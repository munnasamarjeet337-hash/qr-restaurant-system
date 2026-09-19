import uuid
from collections import Counter
from datetime import datetime
from flask import Blueprint, request, jsonify
from app.database import db
from app.utils.auth_middleware import jwt_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/stats', methods=['GET'])
@jwt_required(role='admin')
def get_admin_stats():
    total_users = db.users.count_documents({})
    total_resumes = db.resumes.count_documents({})
    
    # Calculate average score & distribution
    all_resumes = list(db.resumes.find({}))
    scores = []
    distribution = {"High": 0, "Moderate": 0, "Needs Improvement": 0}

    for r in all_resumes:
        score_obj = r.get('score', {})
        if isinstance(score_obj, dict):
            s = score_obj.get('overall_score')
            tier = score_obj.get('tier', 'Moderate')
        else:
            s = r.get('overall_score')
            tier = 'High' if (s or 0) >= 70 else ('Moderate' if (s or 0) >= 40 else 'Needs Improvement')
            
        if s is not None:
            scores.append(float(s))
            if tier in distribution:
                distribution[tier] += 1
            else:
                distribution['Moderate'] += 1

    avg_score = round(sum(scores) / max(1, len(scores)), 1) if scores else 0.0

    # Aggregate in-demand skills across all job listings
    all_jobs = list(db.jobs.find({}))
    skill_counter = Counter()
    category_counter = Counter()

    for j in all_jobs:
        category_counter[j.get('category', 'Technology')] += 1
        for sk in j.get('required_skills', []):
            skill_counter[sk] += 1
        for sk in j.get('preferred_skills', []):
            skill_counter[sk] += 1

    top_skills_chart = [
        {"skill": skill, "count": count}
        for skill, count in skill_counter.most_common(10)
    ]

    jobs_by_category = [
        {"category": cat, "count": cnt}
        for cat, cnt in category_counter.most_common(8)
    ]

    return jsonify({
        "stats": {
            "total_users": total_users,
            "total_resumes": total_resumes,
            "total_jobs": len(all_jobs),
            "average_score": avg_score,
            "distribution": distribution,
            "top_in_demand_skills": top_skills_chart,
            "jobs_by_category": jobs_by_category
        }
    }), 200


@admin_bp.route('/users', methods=['GET'])
@jwt_required(role='admin')
def get_admin_users():
    users_list = list(db.users.find({}, sort=[("created_at", -1)]))
    formatted = []
    
    for u in users_list:
        uid = str(u.get('_id'))
        resume_count = db.resumes.count_documents({"user_id": uid})
        formatted.append({
            "id": uid,
            "name": u.get('name', 'Anonymous User'),
            "email": u.get('email', ''),
            "role": u.get('role', 'user'),
            "is_verified": u.get('is_verified', False),
            "created_at": u.get('created_at', ''),
            "resumes_analyzed": resume_count
        })

    return jsonify({"users": formatted, "count": len(formatted)}), 200


@admin_bp.route('/jobs', methods=['POST'])
@jwt_required(role='admin')
def create_job():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    category = data.get('category', 'Software Engineering').strip()
    
    if not title:
        return jsonify({"error": "Job title is required."}), 400

    req_skills = data.get('required_skills', [])
    if isinstance(req_skills, str):
        req_skills = [s.strip() for s in req_skills.split(',') if s.strip()]

    pref_skills = data.get('preferred_skills', [])
    if isinstance(pref_skills, str):
        pref_skills = [s.strip() for s in pref_skills.split(',') if s.strip()]

    job_doc = {
        "_id": str(uuid.uuid4()),
        "title": title,
        "category": category,
        "experience_level": data.get('experience_level', 'Mid-Level'),
        "min_experience_years": int(data.get('min_experience_years', 2)),
        "salary_range": data.get('salary_range', '$90,000 - $130,000'),
        "location": data.get('location', 'Remote / Hybrid'),
        "description": data.get('description', ''),
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "created_at": datetime.utcnow().isoformat()
    }

    db.jobs.insert_one(job_doc)
    return jsonify({"message": "Job role added successfully.", "job": job_doc}), 201


@admin_bp.route('/jobs/<job_id>', methods=['PUT'])
@jwt_required(role='admin')
def update_job(job_id):
    data = request.get_json() or {}
    
    req_skills = data.get('required_skills')
    if isinstance(req_skills, str):
        req_skills = [s.strip() for s in req_skills.split(',') if s.strip()]

    pref_skills = data.get('preferred_skills')
    if isinstance(pref_skills, str):
        pref_skills = [s.strip() for s in pref_skills.split(',') if s.strip()]

    update_fields = {}
    for k in ['title', 'category', 'experience_level', 'salary_range', 'location', 'description']:
        if k in data:
            update_fields[k] = data[k]

    if 'min_experience_years' in data:
        update_fields['min_experience_years'] = int(data['min_experience_years'])
    if req_skills is not None:
        update_fields['required_skills'] = req_skills
    if pref_skills is not None:
        update_fields['preferred_skills'] = pref_skills

    res = db.jobs.update_one({"_id": job_id}, {"$set": update_fields})
    if res.matched_count == 0:
        # Try id field
        res = db.jobs.update_one({"id": job_id}, {"$set": update_fields})
        
    return jsonify({"message": "Job role updated successfully."}), 200


@admin_bp.route('/jobs/<job_id>', methods=['DELETE'])
@jwt_required(role='admin')
def delete_job(job_id):
    res = db.jobs.delete_one({"_id": job_id})
    if res.deleted_count == 0:
        res = db.jobs.delete_one({"id": job_id})
        
    return jsonify({"message": "Job role deleted successfully."}), 200
