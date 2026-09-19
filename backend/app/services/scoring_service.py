import re

class ScoringService:
    ACTION_VERBS = {
        "architected", "engineered", "developed", "built", "implemented", "designed",
        "spearheaded", "led", "managed", "optimized", "accelerated", "scaled",
        "streamlined", "automated", "orchestrated", "deployed", "transformed",
        "increased", "reduced", "delivered", "mentored", "championed", "created",
        "collaborated", "pioneered", "refactored", "integrated", "audited"
    }

    @staticmethod
    def calculate_skill_match_score(detected_skills, top_job_matched=None):
        """Calculates Skill Match score (0-100) based on industry breadth and target job requirements."""
        total_skills_count = len(detected_skills.get('all', []))
        tech_count = len(detected_skills.get('technical', []))
        tools_count = len(detected_skills.get('tools', []))
        soft_count = len(detected_skills.get('soft_skills', []))
        domain_count = len(detected_skills.get('domain', []))

        # Base breadth score (up to 50 points)
        breadth_score = min(50, (tech_count * 3.5) + (tools_count * 2.0) + (soft_count * 2.5) + (domain_count * 3.0))

        # Job alignment score (up to 50 points)
        alignment_score = 30 # Default baseline
        if top_job_matched and 'required_skills' in top_job_matched:
            req_skills = top_job_matched['required_skills']
            if req_skills:
                all_lower = {s.lower() for s in detected_skills.get('all', [])}
                matched_req = [s for s in req_skills if s.lower() in all_lower]
                ratio = len(matched_req) / len(req_skills)
                alignment_score = min(50, ratio * 50)
        else:
            # General skill density score
            if total_skills_count >= 12:
                alignment_score = 45
            elif total_skills_count >= 8:
                alignment_score = 38
            elif total_skills_count >= 5:
                alignment_score = 30
            else:
                alignment_score = 20

        raw_score = breadth_score + alignment_score
        return round(min(100, max(15, raw_score)), 1)

    @staticmethod
    def calculate_experience_relevance_score(years, experience_text):
        """Calculates Experience Relevance score (0-100) from tenure, quantified impact, and action verbs."""
        # 1. Tenure score (up to 40 pts)
        if years >= 5:
            tenure_score = 40
        elif years >= 3:
            tenure_score = 34
        elif years >= 2:
            tenure_score = 28
        elif years >= 1:
            tenure_score = 22
        else:
            tenure_score = 15

        # 2. Action verbs presence (up to 30 pts)
        text_lower = experience_text.lower()
        words = set(re.findall(r'\b[a-z]{3,}\b', text_lower))
        found_verbs = words.intersection(ScoringService.ACTION_VERBS)
        verb_score = min(30, len(found_verbs) * 4)

        # 3. Quantified metrics & achievements (%, $, numbers, multipliers) (up to 30 pts)
        metric_matches = re.findall(r'(?:\d+%\s*|\$\s*\d+|\b\d+\s*x\b|\b\d+\s*(?:million|k|ms|sec|users|customers|requests|transactions)\b)', text_lower)
        quant_score = min(30, len(metric_matches) * 6)
        if not metric_matches and len(experience_text.split()) > 100:
            quant_score = 10

        raw_score = tenure_score + verb_score + quant_score
        return round(min(100, max(20, raw_score)), 1)

    @staticmethod
    def calculate_ats_formatting_score(sections, contact_info, raw_text):
        """Calculates ATS Formatting score (0-100) from structure, contact info, and parseability."""
        score = 0

        # Section presence (60 pts max)
        if sections.get('experience'):
            score += 25
        if sections.get('education'):
            score += 15
        if sections.get('skills'):
            score += 15
        if sections.get('summary') or sections.get('header'):
            score += 10
        if sections.get('projects') or sections.get('certifications'):
            score += 10

        # Contact info parseability (20 pts max)
        if contact_info.get('email'):
            score += 8
        if contact_info.get('phone'):
            score += 6
        if contact_info.get('linkedin') or contact_info.get('github'):
            score += 6

        # Document word length suitability (20 pts max)
        words_count = len(raw_text.split())
        if 400 <= words_count <= 1200:
            score += 20
        elif 250 <= words_count < 400 or 1200 < words_count <= 1800:
            score += 14
        elif words_count > 0:
            score += 8

        return round(min(100, max(25, score)), 1)

    @staticmethod
    def calculate_keyword_density_score(raw_text, detected_skills):
        """Calculates Keyword Density & Action Verbs score (0-100)."""
        words = re.findall(r'\b[a-zA-Z]{2,}\b', raw_text)
        total_words = len(words)
        if total_words == 0:
            return 20.0

        # Unique skills ratio
        unique_skills = len(detected_skills.get('all', []))
        skill_ratio = unique_skills / max(1, (total_words / 25))
        skill_keyword_pts = min(45, skill_ratio * 40)

        # Action verbs ratio
        lower_words = [w.lower() for w in words]
        verb_count = sum(1 for w in lower_words if w in ScoringService.ACTION_VERBS)
        verb_pts = min(35, (verb_count / max(1, total_words * 0.05)) * 35)

        # Readability & sentence length balance
        sentences = [s for s in re.split(r'[.!?\n]+', raw_text) if len(s.strip().split()) > 3]
        avg_sent_len = (total_words / max(1, len(sentences)))
        readability_pts = 20
        if avg_sent_len > 35 or avg_sent_len < 6:
            readability_pts = 10
        elif 10 <= avg_sent_len <= 25:
            readability_pts = 20

        raw_score = skill_keyword_pts + verb_pts + readability_pts
        return round(min(100, max(20, raw_score)), 1)

    @staticmethod
    def calculate_composite_score(skill_score, exp_score, ats_score, kw_score):
        """
        Explainable formula:
        Total = 0.40 * SkillMatch + 0.30 * ExpRelevance + 0.20 * ATSFormatting + 0.10 * KeywordDensity
        """
        total = (
            0.40 * skill_score +
            0.30 * exp_score +
            0.20 * ats_score +
            0.10 * kw_score
        )
        total = round(min(100, max(0, total)), 1)
        
        # Color coding tier
        if total >= 70.0:
            tier = "High"
            color = "emerald"
            badge = "Strong Candidate"
        elif total >= 40.0:
            tier = "Moderate"
            color = "amber"
            badge = "Competitive with Gaps"
        else:
            tier = "Needs Improvement"
            color = "rose"
            badge = "Significant Gaps"

        return {
            "overall_score": total,
            "tier": tier,
            "color": color,
            "badge": badge,
            "breakdown": {
                "skill_match": {
                    "score": skill_score,
                    "weight": 0.40,
                    "weighted_score": round(skill_score * 0.40, 1),
                    "label": "Skill Match",
                    "description": "Coverage of core industry technical and domain skills"
                },
                "experience_relevance": {
                    "score": exp_score,
                    "weight": 0.30,
                    "weighted_score": round(exp_score * 0.30, 1),
                    "label": "Experience Relevance",
                    "description": "Quantified impact, tenure, and action-oriented career achievements"
                },
                "ats_formatting": {
                    "score": ats_score,
                    "weight": 0.20,
                    "weighted_score": round(ats_score * 0.20, 1),
                    "label": "ATS Formatting",
                    "description": "Standardized section hierarchy, contact completeness, and parseability"
                },
                "keyword_density": {
                    "score": kw_score,
                    "weight": 0.10,
                    "weighted_score": round(kw_score * 0.10, 1),
                    "label": "Keyword Density",
                    "description": "Natural distribution of power verbs and industry terminology"
                }
            }
        }

    @staticmethod
    def generate_suggestions(breakdown, detected_skills, sections, contact_info, raw_text, top_job_matched=None):
        """Generates prioritized, actionable improvement recommendations with estimated score impact."""
        suggestions = []

        # 1. High Priority Suggestions
        if breakdown['skill_match']['score'] < 65:
            missing_text = ""
            if top_job_matched and 'required_skills' in top_job_matched:
                have_lower = {s.lower() for s in detected_skills.get('all', [])}
                missing = [s for s in top_job_matched['required_skills'] if s.lower() not in have_lower]
                if missing:
                    missing_text = f" Consider incorporating high-demand skills such as: {', '.join(missing[:4])}."
            
            suggestions.append({
                "id": "sug-skill-gap",
                "priority": "high",
                "category": "Skills",
                "title": "Bridge High-Impact Core Skill Gaps",
                "what_to_fix": "Your resume displays fewer industry-standard technical keywords than leading applicants." + missing_text,
                "why_it_matters": "Applicant Tracking Systems (ATS) filter candidates by exact skill keywords before human recruiters ever see them.",
                "estimated_impact": "+8 to +14 pts",
                "actionable_steps": [
                    "Add a dedicated 'Technical Skills' section organized by Languages, Frameworks, and Tools.",
                    "Integrate tools used in your project descriptions rather than just listing them once."
                ]
            })

        if breakdown['experience_relevance']['score'] < 65:
            suggestions.append({
                "id": "sug-quantify-impact",
                "priority": "high",
                "category": "Experience",
                "title": "Quantify Accomplishments with Metrics & Action Verbs",
                "what_to_fix": "Several bullet points describe responsibilities rather than measurable business impact.",
                "why_it_matters": "Resumes with quantified metrics (e.g. 'Reduced query latency by 45%', 'Scaled service to 100k users') receive 3x more interview callbacks.",
                "estimated_impact": "+6 to +12 pts",
                "actionable_steps": [
                    "Use the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
                    "Replace passive words ('worked on', 'helped with') with power verbs ('Architected', 'Spearheaded', 'Engineered')."
                ]
            })

        # 2. Medium Priority Suggestions
        if not contact_info.get('linkedin') or not contact_info.get('github'):
            missing_links = []
            if not contact_info.get('linkedin'): missing_links.append('LinkedIn profile')
            if not contact_info.get('github'): missing_links.append('GitHub / Portfolio')
            suggestions.append({
                "id": "sug-online-presence",
                "priority": "medium",
                "category": "Formatting",
                "title": f"Add Links to {', '.join(missing_links)}",
                "what_to_fix": f"We could not detect direct links to your {' and '.join(missing_links)} in the header.",
                "why_it_matters": "Over 85% of tech recruiters click into GitHub repositories and LinkedIn profiles during screening.",
                "estimated_impact": "+3 to +6 pts",
                "actionable_steps": [
                    "Place clean, clickable links (e.g., 'linkedin.com/in/yourname') directly below your name and email.",
                    "Ensure your GitHub contains pinned repositories with clear READMEs."
                ]
            })

        if not sections.get('summary'):
            suggestions.append({
                "id": "sug-pro-summary",
                "priority": "medium",
                "category": "Formatting",
                "title": "Add a Concise Professional Summary",
                "what_to_fix": "Your resume lacks an opening 2-3 line executive summary.",
                "why_it_matters": "A crisp summary immediately anchors your expertise, years of experience, and primary stack for recruiters spending only 6 seconds scanning.",
                "estimated_impact": "+4 to +8 pts",
                "actionable_steps": [
                    "Write a 2-3 sentence summary: 'Full-Stack Engineer with 3+ years architecting React and Python cloud systems...'",
                    "Highlight 1-2 key achievements or primary domain expertise."
                ]
            })

        # 3. Low Priority / Polish Suggestions
        if breakdown['keyword_density']['score'] < 70:
            suggestions.append({
                "id": "sug-keyword-optimization",
                "priority": "low",
                "category": "Keywords",
                "title": "Optimize Action Verb & Terminology Distribution",
                "what_to_fix": "Increase the density of high-frequency engineering verbs across all project descriptions.",
                "why_it_matters": "Improves semantic matching scores on modern AI screening platforms.",
                "estimated_impact": "+2 to +5 pts",
                "actionable_steps": [
                    "Start every single bullet point with a distinct past-tense action verb.",
                    "Ensure tools (Docker, AWS, Git, CI/CD) are mentioned in context of achievements."
                ]
            })

        word_count = len(raw_text.split())
        if word_count < 350:
            suggestions.append({
                "id": "sug-content-depth",
                "priority": "low",
                "category": "Content",
                "title": "Expand Content Depth and Project Details",
                "what_to_fix": f"Your resume contains ~{word_count} words, which is on the shorter side.",
                "why_it_matters": "A standard 1-page technical resume typically has between 450 and 800 words with thorough project bullets.",
                "estimated_impact": "+3 to +6 pts",
                "actionable_steps": [
                    "Add 1-2 featured projects with architecture details, tech stack, and GitHub links.",
                    "Elaborate on database optimization, testing methodologies, or cloud deployments."
                ]
            })

        return suggestions
