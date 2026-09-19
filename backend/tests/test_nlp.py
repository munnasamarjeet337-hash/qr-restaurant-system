import unittest
from app import create_app
from app.services.nlp_service import NLPService
from app.services.scoring_service import ScoringService
from app.services.matcher_service import JobMatcherService

class TestNLPEngine(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()

        self.sample_resume = """
        Alex Morgan
        Email: alex.morgan@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/alexmorgan | GitHub: github.com/alexmorgan
        
        Professional Summary
        Senior Full-Stack Engineer with 5+ years of experience architecting resilient cloud SaaS applications using React, Python, and Docker. Spearheaded microservices migration reducing API latency by 45%.
        
        Work Experience
        Senior Software Engineer - TechCorp Inc. (2021 - Present)
        • Architected and developed high-throughput REST APIs and microservices using Python Flask, FastAPI, and PostgreSQL.
        • Scaled real-time WebSocket notifications serving over 150,000 active daily users with Redis caching.
        • Spearheaded CI/CD pipelines with Docker and GitHub Actions, cutting release deployment cycle time by 60%.
        • Mentored 4 junior software engineers and championed test-driven development with pytest and Jest.
        
        Full-Stack Developer - CloudSystems LLC (2019 - 2021)
        • Built responsive, accessible user interfaces using React, TypeScript, and Tailwind CSS.
        • Designed relational database schemas in PostgreSQL and optimized complex SQL queries for 3x speedup.
        
        Education
        Bachelor of Science in Computer Science - University of California, Berkeley (2015 - 2019)
        
        Technical Skills
        • Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3, Bash
        • Frameworks & Libraries: React, Flask, FastAPI, Node.js, Tailwind CSS, Redux
        • Cloud & Databases: PostgreSQL, MongoDB, Redis, Docker, AWS, Git, CI/CD
        • Soft Skills: Leadership, Problem Solving, Agile, Communication, Mentorship
        """

    def tearDown(self):
        self.app_context.pop()

    def test_skill_extraction(self):
        skills = NLPService.extract_skills(self.sample_resume)
        self.assertIn("Python", skills["technical"])
        self.assertIn("React", skills["technical"])
        self.assertIn("Docker", skills["technical"])
        self.assertIn("PostgreSQL", skills["technical"])
        self.assertIn("Leadership", skills["soft_skills"])
        self.assertIn("Git", skills["tools"])
        self.assertGreaterEqual(skills["counts"]["total"], 10)

    def test_experience_extraction(self):
        years = NLPService.extract_experience_years(self.sample_resume)
        self.assertGreaterEqual(years, 4)

    def test_explainable_scoring_formula(self):
        skills = NLPService.extract_skills(self.sample_resume)
        years = NLPService.extract_experience_years(self.sample_resume)
        
        skill_score = ScoringService.calculate_skill_match_score(skills)
        exp_score = ScoringService.calculate_experience_relevance_score(years, self.sample_resume)
        ats_score = ScoringService.calculate_ats_formatting_score({
            "experience": "Yes", "education": "Yes", "skills": "Yes", "summary": "Yes"
        }, {"email": "alex@example.com", "phone": "555-1234", "linkedin": "linkedin.com/in/alex"}, self.sample_resume)
        kw_score = ScoringService.calculate_keyword_density_score(self.sample_resume, skills)

        composite = ScoringService.calculate_composite_score(skill_score, exp_score, ats_score, kw_score)
        
        # Verify formula precision: Total = 0.40 * S + 0.30 * E + 0.20 * A + 0.10 * K
        expected_total = round(0.40 * skill_score + 0.30 * exp_score + 0.20 * ats_score + 0.10 * kw_score, 1)
        self.assertEqual(composite["overall_score"], expected_total)
        self.assertGreaterEqual(composite["overall_score"], 70.0)
        self.assertEqual(composite["tier"], "High")

    def test_tfidf_job_matching(self):
        skills = NLPService.extract_skills(self.sample_resume)
        matched_jobs = JobMatcherService.match_resume_with_jobs(self.sample_resume, skills)
        self.assertGreater(len(matched_jobs), 0)
        top_match = matched_jobs[0]
        self.assertGreater(top_match["match_percentage"], 50.0)
        self.assertTrue(len(top_match["matching_skills"]) > 0)

if __name__ == '__main__':
    unittest.main()
