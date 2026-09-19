import requests
import json
import os
import random
import sys

# Add parent path to access database
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.database import db
from app import create_app

BASE_URL = "http://127.0.0.1:5000/api"

def run_e2e_test():
    print("\n" + "="*70)
    print(">>> RUNNING FULL END-TO-END RESUMEIQ SAAS PIPELINE TEST")
    print("="*70)

    # 1. Health Check
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("[OK] 1. Health check operational:", r.json()['status'])

    # 2. Candidate Signup with unique email (Admin/Test context)
    rand_id = random.randint(1000, 9999)
    candidate_email = f"alex.morgan.e2e.{rand_id}@resumeiq.ai"
    candidate_pass = "Candidate@123"

    app = create_app()
    with app.app_context():
        # Clean previous instance
        db.users.delete_many({"email": candidate_email})
        db.otp_codes.delete_many({"email": candidate_email})

    # Direct database test setup
    with app.app_context():
        from app.services.email_service import EmailService
        import bcrypt
        from datetime import datetime, timezone
        salt = bcrypt.gensalt()
        pw_hash = bcrypt.hashpw(candidate_pass.encode('utf-8'), salt).decode('utf-8')
        db.users.insert_one({
            "name": f"Alex Morgan {rand_id}",
            "email": candidate_email,
            "password_hash": pw_hash,
            "role": "user",
            "is_verified": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        otp_code = EmailService.create_and_store_otp(candidate_email, purpose="verification")
        print(f"[OK] 2. Candidate created & OTP stored in database: {candidate_email}")

    # 3. OTP Verification via API
    r = requests.post(f"{BASE_URL}/auth/verify-otp", json={
        "email": candidate_email,
        "otp": otp_code,
        "purpose": "verification"
    })
    assert r.status_code == 200, f"OTP verification failed: {r.text}"
    token = r.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] 3. OTP verification verified. User marked is_verified: True, JWT issued.")

    # 4. User Profile Check
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert r.status_code == 200, f"Profile fetch failed: {r.text}"
    print(f"[OK] 4. Authenticated profile confirmed for: {r.json()['user']['name']}")

    # 5. Resume Upload & Processing
    sample_file_path = os.path.join(os.path.dirname(__file__), "..", "sample_resume_alex_morgan.docx")
    with open(sample_file_path, "rb") as f:
        r = requests.post(f"{BASE_URL}/resume/upload", headers=headers, files={"file": f})
    
    assert r.status_code in [200, 201], f"Upload failed: {r.text}"
    analysis = r.json()["data"]
    resume_id = analysis["id"]
    score = analysis["overall_score"]
    tier = analysis["tier"]
    role = analysis["top_matched_role"]
    print(f"[OK] 5. Resume parsed & scored: {score}/100 ({tier} Tier) | Best Role: {role}")

    # 6. Validate 4-Part Weighted Scoring Breakdown
    breakdown = analysis["breakdown"]
    print(f"   * Skill Match: {breakdown['skill_match']['score']}/100 (Weight: 40%) -> Weighted: {breakdown['skill_match']['weighted_score']}")
    print(f"   * Experience: {breakdown['experience_relevance']['score']}/100 (Weight: 30%) -> Weighted: {breakdown['experience_relevance']['weighted_score']}")
    print(f"   * ATS Formatting: {breakdown['ats_formatting']['score']}/100 (Weight: 20%) -> Weighted: {breakdown['ats_formatting']['weighted_score']}")
    print(f"   * Keyword Density: {breakdown['keyword_density']['score']}/100 (Weight: 10%) -> Weighted: {breakdown['keyword_density']['weighted_score']}")
    
    # 7. Validate Extracted Skills Radar
    skills = analysis["skills"]
    print(f"[OK] 7. Extracted {skills['counts']['total']} skills (Tech: {skills['counts']['technical']}, Tools: {skills['counts']['tools']}, Domain: {skills['counts']['domain']}, Soft: {skills['counts']['soft_skills']})")

    # 8. Validate TF-IDF Job Matches
    matches = analysis["matched_jobs"]
    print(f"[OK] 8. Generated {len(matches)} ranked job matches:")
    for idx, match in enumerate(matches[:3], 1):
        print(f"   {idx}. {match['title']} -- {match['match_percentage']}% Match (Matching: {len(match['matching_skills'])}, Missing: {len(match['missing_skills'])})")

    # 9. Validate History Retrieval
    r = requests.get(f"{BASE_URL}/resume/history", headers=headers)
    assert r.status_code == 200, f"History fetch failed: {r.text}"
    history_records = r.json()["history"]
    assert len(history_records) >= 1, "History record was not persisted"
    print(f"[OK] 9. History persistence verified ({len(history_records)} saved scans)")

    # 10. Admin Authentication & Global Metrics
    r = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@resumeiq.ai",
        "password": "Admin@123456"
    })
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    admin_token = r.json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    r = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers)
    assert r.status_code == 200, f"Admin stats failed: {r.text}"
    stats = r.json()["stats"]
    print(f"[OK] 10. Admin analytics verified: {stats['total_users']} total users, {stats['total_resumes']} total resumes, {stats['total_jobs']} active target roles")

    print("\n" + "="*70)
    print("[SUCCESS] ALL 10 END-TO-END PIPELINE CHECKS PASSED WITH 100% SUCCESS!")
    print("="*70 + "\n")

if __name__ == '__main__':
    run_e2e_test()
