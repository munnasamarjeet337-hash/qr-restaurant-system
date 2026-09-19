import os
import json
import uuid
import threading
from datetime import datetime
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

class LocalCollection:
    """Thread-safe, JSON-persisted collection providing a PyMongo-compatible interface."""
    def __init__(self, name, db_filepath, lock):
        self.name = name
        self.db_filepath = db_filepath
        self.lock = lock
        self._ensure_file()

    def _ensure_file(self):
        with self.lock:
            if not os.path.exists(self.db_filepath):
                os.makedirs(os.path.dirname(self.db_filepath), exist_ok=True)
                with open(self.db_filepath, 'w', encoding='utf-8') as f:
                    json.dump({self.name: []}, f, default=str)
            else:
                try:
                    with open(self.db_filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    if self.name not in data:
                        data[self.name] = []
                        with open(self.db_filepath, 'w', encoding='utf-8') as f:
                            json.dump(data, f, default=str)
                except Exception:
                    with open(self.db_filepath, 'w', encoding='utf-8') as f:
                        json.dump({self.name: []}, f, default=str)

    def _read(self):
        with self.lock:
            try:
                with open(self.db_filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get(self.name, [])
            except Exception:
                return []

    def _write(self, records):
        with self.lock:
            try:
                if os.path.exists(self.db_filepath):
                    with open(self.db_filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                else:
                    data = {}
                data[self.name] = records
                with open(self.db_filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, default=str)
            except Exception as e:
                print(f"[LocalDB] Write error: {e}")

    def _match(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == '_id':
                if str(doc.get('_id')) != str(v):
                    return False
            elif isinstance(v, dict):
                # Simple operator support ($in, $ne, $gte, etc.)
                if '$in' in v and doc.get(k) not in v['$in']:
                    return False
                if '$ne' in v and doc.get(k) == v['$ne']:
                    return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    def find(self, query=None, sort=None, limit=None, skip=0):
        records = self._read()
        filtered = [doc for doc in records if self._match(doc, query or {})]
        if sort:
            for field, order in reversed(sort):
                reverse = (order == -1 or order == pymongo.DESCENDING)
                filtered.sort(key=lambda x: (x.get(field) is None, x.get(field, '')), reverse=reverse)
        if skip:
            filtered = filtered[skip:]
        if limit:
            filtered = filtered[:limit]
        return filtered

    def find_one(self, query=None):
        records = self._read()
        for doc in records:
            if self._match(doc, query or {}):
                return doc
        return None

    def insert_one(self, doc):
        records = self._read()
        new_doc = dict(doc)
        if '_id' not in new_doc or not new_doc['_id']:
            new_doc['_id'] = str(uuid.uuid4())
        else:
            new_doc['_id'] = str(new_doc['_id'])
        if 'created_at' not in new_doc:
            new_doc['created_at'] = datetime.utcnow().isoformat()
        records.append(new_doc)
        self._write(records)
        class InsertResult:
            inserted_id = new_doc['_id']
        return InsertResult()

    def insert_many(self, docs):
        records = self._read()
        inserted_ids = []
        for doc in docs:
            new_doc = dict(doc)
            if '_id' not in new_doc or not new_doc['_id']:
                new_doc['_id'] = str(uuid.uuid4())
            else:
                new_doc['_id'] = str(new_doc['_id'])
            if 'created_at' not in new_doc:
                new_doc['created_at'] = datetime.utcnow().isoformat()
            records.append(new_doc)
            inserted_ids.append(new_doc['_id'])
        self._write(records)
        class InsertManyResult:
            pass
        res = InsertManyResult()
        res.inserted_ids = inserted_ids
        return res

    def update_one(self, query, update, upsert=False):
        records = self._read()
        matched = False
        for i, doc in enumerate(records):
            if self._match(doc, query):
                matched = True
                if '$set' in update:
                    for k, v in update['$set'].items():
                        doc[k] = v
                if '$unset' in update:
                    for k in update['$unset']:
                        doc.pop(k, None)
                doc['updated_at'] = datetime.utcnow().isoformat()
                records[i] = doc
                break
        if not matched and upsert:
            new_doc = dict(query)
            if '$set' in update:
                new_doc.update(update['$set'])
            new_doc['_id'] = str(uuid.uuid4())
            new_doc['created_at'] = datetime.utcnow().isoformat()
            records.append(new_doc)
        self._write(records)
        class UpdateResult:
            matched_count = 1 if matched else 0
            modified_count = 1 if matched else 0
        return UpdateResult()

    def delete_one(self, query):
        records = self._read()
        for i, doc in enumerate(records):
            if self._match(doc, query):
                records.pop(i)
                self._write(records)
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResultEmpty:
            deleted_count = 0
        return DeleteResultEmpty()

    def delete_many(self, query):
        records = self._read()
        new_records = [doc for doc in records if not self._match(doc, query)]
        deleted_count = len(records) - len(new_records)
        self._write(new_records)
        class DeleteResult:
            pass
        res = DeleteResult()
        res.deleted_count = deleted_count
        return res

    def count_documents(self, query=None):
        records = self._read()
        return len([doc for doc in records if self._match(doc, query or {})])

    def create_index(self, *args, **kwargs):
        pass


class Database:
    def __init__(self):
        self.is_mongo = False
        self.client = None
        self.db = None
        self.users = None
        self.resumes = None
        self.jobs = None
        self.otp_codes = None
        self.lock = threading.Lock()

    def init_app(self, app):
        mongo_uri = app.config.get('MONGO_URI', 'mongodb://localhost:27017/resumeiq')
        db_name = app.config.get('DB_NAME', 'resumeiq')
        
        try:
            client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=1500)
            # Test connection
            client.admin.command('ping')
            self.client = client
            self.db = client[db_name]
            self.users = self.db['users']
            self.resumes = self.db['resumes']
            self.jobs = self.db['jobs']
            self.otp_codes = self.db['otp_codes']
            self.is_mongo = True
            print("[Database] Successfully connected to live MongoDB!")
        except Exception as e:
            print(f"[Database] MongoDB not available ({e}). Initializing robust local JSON storage.")
            db_path = os.path.join(app.root_path, '..', 'data_storage', 'database.json')
            self.users = LocalCollection('users', db_path, self.lock)
            self.resumes = LocalCollection('resumes', db_path, self.lock)
            self.jobs = LocalCollection('jobs', db_path, self.lock)
            self.otp_codes = LocalCollection('otp_codes', db_path, self.lock)
            self.is_mongo = False

        self._seed_data(app)

    def _seed_data(self, app):
        # 1. Seed jobs if empty
        try:
            if self.jobs.count_documents({}) == 0:
                seed_file = os.path.join(app.root_path, 'data', 'jobs_seed.json')
                if os.path.exists(seed_file):
                    with open(seed_file, 'r', encoding='utf-8') as f:
                        jobs_data = json.load(f)
                    for j in jobs_data:
                        if '_id' not in j:
                            j['_id'] = j.get('id', str(uuid.uuid4()))
                        self.jobs.insert_one(j)
                    print(f"[Database] Successfully seeded {len(jobs_data)} job roles.")
        except Exception as e:
            print(f"[Database] Error seeding jobs: {e}")

        # 2. Seed default admin user if not exists
        try:
            import bcrypt
            admin_user = self.users.find_one({"email": "admin@resumeiq.ai"})
            if not admin_user:
                hashed_pw = bcrypt.hashpw("Admin@123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                self.users.insert_one({
                    "name": "System Administrator",
                    "email": "admin@resumeiq.ai",
                    "password_hash": hashed_pw,
                    "role": "admin",
                    "is_verified": True,
                    "created_at": datetime.utcnow().isoformat()
                })
                print("[Database] Default Admin created: admin@resumeiq.ai / Admin@123456")
        except Exception as e:
            print(f"[Database] Error seeding admin user: {e}")

db = Database()
