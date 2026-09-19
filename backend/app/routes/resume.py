import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from app.database import db
from app.utils.auth_middleware import jwt_required
from app.services.parser_service import ResumeParserService
from app.services.nlp_service import NLPService
from app.services.scoring_service import ScoringService
from app.services.matcher_service import JobMatcherService

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@resume_bp.route('/upload', methods=['POST'])
@jwt_required(optional=True)
def upload_and_analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded in request."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for upload."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file format. Please upload a PDF or DOCX file."}), 400

    # Ensure upload directory exists
    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

    original_filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex[:10]}_{original_filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    
    file.save(filepath)
    file_size_kb = round(os.path.getsize(filepath) / 1024, 1)

    try:
        # 1. Parse Text
        raw_text = ResumeParserService.extract_text_from_file(filepath)
        cleaned_text = ResumeParserService.clean_text(raw_text)
        
        if len(cleaned_text.strip()) < 50:
            return jsonify({"error": "Uploaded document contains insufficient readable text."}), 400

        # 2. Contact & Structural Extraction
        contact_info = ResumeParserService.extract_contact_info(cleaned_text)
        sections = ResumeParserService.segment_sections(cleaned_text)

        # 3. NLP Skill & Entity Extraction
        detected_skills = NLPService.extract_skills(cleaned_text)
        experience_years = NLPService.extract_experience_years(cleaned_text)
        education_info = NLPService.extract_education(cleaned_text)

        # 4. Job Matching via TF-IDF + Cosine Similarity + Skill Overlap
        matched_jobs = JobMatcherService.match_resume_with_jobs(cleaned_text, detected_skills)
        top_job = matched_jobs[0] if matched_jobs else None

        # 5. Explainable 4-Part Scoring
        skill_score = ScoringService.calculate_skill_match_score(detected_skills, top_job)
        exp_score = ScoringService.calculate_experience_relevance_score(experience_years, sections.get('experience', cleaned_text))
        ats_score = ScoringService.calculate_ats_formatting_score(sections, contact_info, cleaned_text)
        kw_score = ScoringService.calculate_keyword_density_score(cleaned_text, detected_skills)
        
        composite_score = ScoringService.calculate_composite_score(skill_score, exp_score, ats_score, kw_score)

        # 6. Actionable Suggestions
        suggestions = ScoringService.generate_suggestions(
            composite_score['breakdown'],
            detected_skills,
            sections,
            contact_info,
            cleaned_text,
            top_job
        )

        user_id = str(request.current_user['_id']) if request.current_user else "anonymous"

        # Build analysis document
        resume_doc = {
            "user_id": user_id,
            "filename": original_filename,
            "file_size_kb": file_size_kb,
            "filepath": filepath,
            "candidate_name": contact_info.get('candidate_name') or (request.current_user.get('name') if request.current_user else "Candidate"),
            "contact_info": contact_info,
            "education": education_info,
            "experience_years": experience_years,
            "skills": detected_skills,
            "sections_found": [k for k, v in sections.items() if v],
            "score": composite_score,
            "top_matched_role": top_job.get('title') if top_job else "Software Engineer",
            "top_matched_percentage": top_job.get('match_percentage') if top_job else 0,
            "matched_jobs": matched_jobs,
            "suggestions": suggestions,
            "created_at": datetime.utcnow().isoformat()
        }

        insert_res = db.resumes.insert_one(resume_doc)
        resume_id = str(insert_res.inserted_id)

        response_data = {
            "id": resume_id,
            "filename": original_filename,
            "file_size_kb": file_size_kb,
            "candidate_name": resume_doc["candidate_name"],
            "overall_score": composite_score['overall_score'],
            "tier": composite_score['tier'],
            "color": composite_score['color'],
            "badge": composite_score['badge'],
            "breakdown": composite_score['breakdown'],
            "skills": detected_skills,
            "experience_years": experience_years,
            "education": education_info,
            "contact_info": contact_info,
            "top_matched_role": resume_doc["top_matched_role"],
            "matched_jobs": matched_jobs,
            "suggestions": suggestions,
            "created_at": resume_doc["created_at"]
        }

        return jsonify({
            "message": "Resume analyzed successfully.",
            "data": response_data
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to analyze resume: {str(e)}"}), 500


@resume_bp.route('/<resume_id>', methods=['GET'])
@jwt_required(optional=True)
def get_resume_analysis(resume_id):
    resume = db.resumes.find_one({"_id": resume_id})
    if not resume:
        return jsonify({"error": "Resume analysis not found."}), 404

    # Format for JSON response
    resume['id'] = str(resume.get('_id'))
    resume.pop('_id', None)
    return jsonify({"data": resume}), 200


@resume_bp.route('/history', methods=['GET'])
@jwt_required()
def get_user_resume_history():
    user_id = str(request.current_user['_id'])
    
    # Query resumes for this user
    resumes_cursor = db.resumes.find(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )
    resumes_list = list(resumes_cursor)

    history = []
    trend = []

    for r in resumes_list:
        score_val = r.get('score', {}).get('overall_score', 0) if isinstance(r.get('score'), dict) else r.get('overall_score', 0)
        item = {
            "id": str(r.get('_id')),
            "filename": r.get('filename', 'Resume.pdf'),
            "created_at": r.get('created_at'),
            "overall_score": score_val,
            "tier": r.get('score', {}).get('tier', 'Moderate'),
            "color": r.get('score', {}).get('color', 'amber'),
            "top_matched_role": r.get('top_matched_role', 'Software Engineer'),
            "skills_count": len(r.get('skills', {}).get('all', [])) if isinstance(r.get('skills'), dict) else 0,
            "experience_years": r.get('experience_years', 1)
        }
        history.append(item)

    # For trend chart, reverse to chronological order
    chronological = list(reversed(history))
    for idx, item in enumerate(chronological):
        date_str = item['created_at'][:10] if item.get('created_at') else f"Scan {idx+1}"
        trend.append({
            "scan_number": idx + 1,
            "date": date_str,
            "score": item['overall_score'],
            "filename": item['filename']
        })

    return jsonify({
        "history": history,
        "trend": trend,
        "total_analyzed": len(history)
    }), 200


@resume_bp.route('/<resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume_analysis(resume_id):
    user_id = str(request.current_user['_id'])
    res = db.resumes.delete_one({"_id": resume_id, "user_id": user_id})
    if res.deleted_count == 0:
        return jsonify({"error": "Resume record not found or permission denied."}), 404
        
    return jsonify({"message": "Resume record deleted successfully."}), 200
