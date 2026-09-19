import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.database import db

class JobMatcherService:
    @staticmethod
    def match_resume_with_jobs(resume_text, detected_skills, min_similarity=0.10):
        """
        Matches resume text with job descriptions using TF-IDF Vectorization and Cosine Similarity,
        combined with exact skill overlap analysis.
        """
        # Fetch all active jobs from DB
        jobs_cursor = db.jobs.find({})
        all_jobs = list(jobs_cursor)
        
        if not all_jobs:
            return []

        # Prepare corpus for TF-IDF
        # Clean resume text + emphasize detected skills
        skills_str = " ".join(detected_skills.get('all', []))
        augmented_resume_text = f"{resume_text} {skills_str} {skills_str}"
        
        corpus = [augmented_resume_text]
        job_docs = []
        
        for job in all_jobs:
            req_skills = " ".join(job.get('required_skills', []))
            pref_skills = " ".join(job.get('preferred_skills', []))
            doc = f"{job.get('title', '')} {job.get('category', '')} {job.get('description', '')} {req_skills} {pref_skills}"
            job_docs.append(doc)
            corpus.append(doc)

        # Compute TF-IDF matrix
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(corpus)
        
        resume_vector = tfidf_matrix[0:1]
        job_vectors = tfidf_matrix[1:]
        
        # Calculate Cosine Similarities
        cosine_sims = cosine_similarity(resume_vector, job_vectors)[0]
        
        candidate_skills_lower = {s.lower() for s in detected_skills.get('all', [])}
        matched_results = []

        for idx, job in enumerate(all_jobs):
            cos_score = float(cosine_sims[idx]) # Range 0.0 to 1.0
            
            # Detailed skill overlap
            req_skills = job.get('required_skills', [])
            pref_skills = job.get('preferred_skills', [])
            
            matching_req = [s for s in req_skills if s.lower() in candidate_skills_lower]
            missing_req = [s for s in req_skills if s.lower() not in candidate_skills_lower]
            matching_pref = [s for s in pref_skills if s.lower() in candidate_skills_lower]
            
            req_ratio = len(matching_req) / max(1, len(req_skills))
            
            # Composite Match Percentage formula
            # 50% Cosine semantic similarity + 50% Direct required skill overlap
            raw_match_pct = (cos_score * 45.0) + (req_ratio * 55.0)
            final_match_pct = round(min(98.5, max(12.0, raw_match_pct * 100 / 100)), 1)
            
            # Generate explainable match reasoning
            why_it_matches = JobMatcherService._generate_why_matches(
                job.get('title', 'Role'),
                final_match_pct,
                matching_req,
                missing_req,
                job.get('min_experience_years', 0)
            )

            matched_results.append({
                "job_id": str(job.get('_id', job.get('id', ''))),
                "title": job.get('title', 'Software Engineer'),
                "category": job.get('category', 'Technology'),
                "experience_level": job.get('experience_level', 'Mid-Level'),
                "min_experience_years": job.get('min_experience_years', 2),
                "salary_range": job.get('salary_range', '$90,000 - $130,000'),
                "location": job.get('location', 'Remote / Hybrid'),
                "description": job.get('description', ''),
                "match_percentage": final_match_pct,
                "cosine_similarity": round(cos_score, 3),
                "matching_skills": matching_req + matching_pref,
                "missing_skills": missing_req,
                "required_skills_count": len(req_skills),
                "matched_skills_count": len(matching_req),
                "why_it_matches": why_it_matches
            })

        # Sort descending by match percentage
        matched_results.sort(key=lambda x: x['match_percentage'], reverse=True)
        return matched_results

    @staticmethod
    def _generate_why_matches(job_title, match_pct, matching_skills, missing_skills, min_exp):
        reasons = []
        if match_pct >= 75:
            reasons.append(f"Outstanding alignment with {job_title} role requirements.")
        elif match_pct >= 50:
            reasons.append(f"Strong foundational match with core competencies for {job_title}.")
        else:
            reasons.append(f"Potential transition pathway into {job_title} with targeted upskilling.")

        if matching_skills:
            top_matched = ", ".join(matching_skills[:4])
            reasons.append(f"Direct overlap in high-priority skills: {top_matched}.")

        if missing_skills:
            top_missing = ", ".join(missing_skills[:3])
            reasons.append(f"Acquiring {top_missing} will significantly strengthen application competitiveness.")

        return " ".join(reasons)
