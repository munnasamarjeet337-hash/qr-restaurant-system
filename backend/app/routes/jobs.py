from flask import Blueprint, request, jsonify
from app.database import db

jobs_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@jobs_bp.route('', methods=['GET'])
def get_jobs():
    category = request.args.get('category', '').strip()
    search = request.args.get('search', '').strip().lower()
    experience = request.args.get('experience', '').strip()

    query = {}
    if category and category != 'All':
        query['category'] = category

    if experience and experience != 'All':
        query['experience_level'] = experience

    jobs_cursor = db.jobs.find(query)
    jobs_list = list(jobs_cursor)

    if search:
        jobs_list = [
            j for j in jobs_list
            if search in j.get('title', '').lower()
            or search in j.get('description', '').lower()
            or any(search in s.lower() for s in j.get('required_skills', []))
        ]

    formatted_jobs = []
    for j in jobs_list:
        j_copy = dict(j)
        j_copy['id'] = str(j.get('_id', j.get('id', '')))
        j_copy.pop('_id', None)
        formatted_jobs.append(j_copy)

    return jsonify({"jobs": formatted_jobs, "count": len(formatted_jobs)}), 200


@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job_detail(job_id):
    job = db.jobs.find_one({"_id": job_id})
    if not job:
        job = db.jobs.find_one({"id": job_id})
        
    if not job:
        return jsonify({"error": "Job not found."}), 404

    job_data = dict(job)
    job_data['id'] = str(job.get('_id', job.get('id', '')))
    job_data.pop('_id', None)
    return jsonify({"job": job_data}), 200


@jobs_bp.route('/categories', methods=['GET'])
def get_categories():
    all_jobs = list(db.jobs.find({}))
    categories = sorted(list({j.get('category', 'Technology') for j in all_jobs if j.get('category')}))
    return jsonify({"categories": ["All"] + categories}), 200
