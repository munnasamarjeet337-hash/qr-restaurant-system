import re
from datetime import datetime

class NLPService:
    # 1. Comprehensive Skill Taxonomy
    SKILL_TAXONOMY = {
        "technical": [
            # Programming Languages
            "python", "javascript", "typescript", "java", "c++", "c#", "c", "golang", "go",
            "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql", "html", "html5",
            "css", "css3", "sass", "scss", "bash", "shell", "powershell", "perl",
            
            # Frontend
            "react", "react.js", "next.js", "nextjs", "vue", "vue.js", "nuxt.js", "angular",
            "svelte", "tailwind css", "tailwindcss", "bootstrap", "material ui", "chakra ui",
            "framer motion", "redux", "redux toolkit", "zustand", "mobx", "webpack", "vite",
            "webgl", "three.js", "d3.js", "recharts",
            
            # Backend & APIs
            "node.js", "nodejs", "express", "express.js", "flask", "django", "fastapi",
            "spring", "spring boot", "asp.net", ".net core", "ruby on rails", "laravel",
            "graphql", "rest apis", "restful api", "rest", "grpc", "microservices", "websockets",
            "celery", "rabbitmq", "apache kafka", "kafka",
            
            # Databases & Storage
            "postgresql", "postgres", "mongodb", "mysql", "redis", "dynamodb", "cassandra",
            "elasticsearch", "sqlite", "snowflake", "bigquery", "mariadb", "neo4j", "supabase", "firebase",
            
            # Cloud & DevOps
            "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
            "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", "helm",
            "prometheus", "grafana", "linux", "unix", "nginx", "apache",
            
            # AI, ML & Data Science
            "machine learning", "deep learning", "nlp", "natural language processing",
            "computer vision", "llms", "large language models", "transformers", "pytorch",
            "tensorflow", "keras", "scikit-learn", "sklearn", "spacy", "nltk", "opencv",
            "hugging face", "pandas", "numpy", "scipy", "xgboost", "lightgbm", "langchain",
            "vector databases", "pinecone", "chromadb",
            
            # Mobile
            "react native", "flutter", "swiftui", "uikit", "android development", "ios development",
            
            # Testing & QA
            "jest", "cypress", "selenium", "playwright", "pytest", "unit testing", "integration testing",
            "e2e testing", "postman", "test automation"
        ],
        "soft_skills": [
            "leadership", "communication", "teamwork", "problem solving", "critical thinking",
            "time management", "agile", "scrum", "kanban", "adaptability", "collaboration",
            "mentorship", "presentation", "analytical thinking", "creativity", "negotiation",
            "conflict resolution", "cross-functional collaboration", "stakeholder management"
        ],
        "tools": [
            "git", "github", "gitlab", "bitbucket", "jira", "confluence", "figma", "postman",
            "vs code", "pycharm", "intellij", "docker", "notion", "trello", "tableau",
            "power bi", "slack", "miro", "linear", "datadog", "sentry", "splunk"
        ],
        "domain": [
            "saas", "fintech", "e-commerce", "ecommerce", "healthcare", "cybersecurity",
            "cloud architecture", "system design", "distributed systems", "high availability",
            "database design", "data modeling", "security best practices", "owasp",
            "information security", "scalability", "event-driven architecture"
        ]
    }

    # Normalized display mappings for clean presentation
    SKILL_DISPLAY_MAP = {
        "react.js": "React", "react": "React", "nextjs": "Next.js", "next.js": "Next.js",
        "vue.js": "Vue.js", "vue": "Vue.js", "node.js": "Node.js", "nodejs": "Node.js",
        "express.js": "Express", "express": "Express", "tailwindcss": "Tailwind CSS",
        "tailwind css": "Tailwind CSS", "amazon web services": "AWS", "aws": "AWS",
        "google cloud": "GCP", "gcp": "GCP", "k8s": "Kubernetes", "kubernetes": "Kubernetes",
        "restful api": "REST APIs", "rest apis": "REST APIs", "rest": "REST APIs",
        "postgres": "PostgreSQL", "postgresql": "PostgreSQL", "sklearn": "scikit-learn",
        "scikit-learn": "scikit-learn", "nlp": "NLP", "llms": "LLMs",
        "ci/cd": "CI/CD", "github actions": "GitHub Actions", "gitlab ci": "GitLab CI"
    }

    @staticmethod
    def extract_skills(text):
        """Extracts skills grouped by category from raw resume text."""
        lower_text = " " + text.lower() + " "
        # Replace punctuation that attaches to words (keep +, #, .)
        sanitized_text = re.sub(r'[,;/|()\n\r\t]', ' ', lower_text)
        
        detected = {
            "technical": set(),
            "soft_skills": set(),
            "tools": set(),
            "domain": set(),
            "all": set()
        }

        for category, skill_list in NLPService.SKILL_TAXONOMY.items():
            for skill in skill_list:
                # Skill boundary check (handle C++, C#, .NET, etc.)
                if skill == "c":
                    pattern = r'(?:\b|[\s,])c(?:\b|[\s,])'
                elif skill == "c++":
                    pattern = r'(?:\b|[\s,])c\+\+(?:\b|[\s,])'
                elif skill == "c#":
                    pattern = r'(?:\b|[\s,])c#(?:\b|[\s,])'
                elif skill == ".net core":
                    pattern = r'\.net\s*core\b'
                elif skill == "r":
                    pattern = r'(?:\b|[\s,])r(?:\b|[\s,])'
                elif skill == "go" or skill == "golang":
                    pattern = r'\b(?:go|golang)\b'
                else:
                    escaped = re.escape(skill)
                    pattern = rf'\b{escaped}\b'
                
                if re.search(pattern, sanitized_text, re.IGNORECASE):
                    display_name = NLPService.SKILL_DISPLAY_MAP.get(skill, skill.title())
                    detected[category].add(display_name)
                    detected["all"].add(display_name)

        return {
            "technical": sorted(list(detected["technical"])),
            "soft_skills": sorted(list(detected["soft_skills"])),
            "tools": sorted(list(detected["tools"])),
            "domain": sorted(list(detected["domain"])),
            "all": sorted(list(detected["all"])),
            "counts": {
                "technical": len(detected["technical"]),
                "soft_skills": len(detected["soft_skills"]),
                "tools": len(detected["tools"]),
                "domain": len(detected["domain"]),
                "total": len(detected["all"])
            }
        }

    @staticmethod
    def extract_experience_years(text):
        """Detects employment dates and calculates estimated years of professional experience."""
        current_year = datetime.now().year
        # Patterns for year ranges (e.g. 2018 - 2023, 2021-Present, Jan 2019 – Present)
        year_ranges = re.findall(r'(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(20[0-2][0-9]|199[0-9])\s*(?:–|-|to)\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(20[0-2][0-9]|present|current|now)', text, re.IGNORECASE)
        
        total_months = 0
        spans = []

        for start_str, end_str in year_ranges:
            start_yr = int(start_str)
            if end_str.lower() in ('present', 'current', 'now'):
                end_yr = current_year
            else:
                try:
                    end_yr = int(end_str)
                except ValueError:
                    end_yr = current_year
            
            if start_yr <= end_yr and (end_yr - start_yr) <= 35:
                spans.append((start_yr, end_yr))

        # Explicit mentions like "4+ years of experience"
        explicit_match = re.findall(r'(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:experience|working)', text, re.IGNORECASE)
        if explicit_match:
            try:
                explicit_years = max(int(m) for m in explicit_match)
                if explicit_years < 40:
                    return explicit_years
            except Exception:
                pass

        if spans:
            # Merge overlapping intervals
            spans.sort(key=lambda x: x[0])
            merged = [spans[0]]
            for current in spans[1:]:
                prev = merged[-1]
                if current[0] <= prev[1]:
                    merged[-1] = (prev[0], max(prev[1], current[1]))
                else:
                    merged.append(current)
            
            calculated_years = sum(end - start for start, end in merged)
            return max(1, calculated_years)

        return 1  # Default to 1 year for entry-level if undetectable

    @staticmethod
    def extract_education(text):
        """Extracts degrees, majors, and universities."""
        degree_patterns = [
            r"\b(?:Ph\.?D|Doctor of Philosophy)\b",
            r"\b(?:Master's|Masters|Master of Science|M\.?S|M\.?Tech|MBA|Master of Arts|M\.?A)\b",
            r"\b(?:Bachelor's|Bachelors|Bachelor of Science|B\.?S|B\.?Tech|B\.?E|Bachelor of Arts|B\.?A|BCA|MCA)\b",
            r"\b(?:Associate Degree|A\.?S|Diploma)\b"
        ]
        
        found_degrees = []
        for p in degree_patterns:
            matches = re.findall(p, text, re.IGNORECASE)
            for m in matches:
                clean_m = m.strip()
                if clean_m not in found_degrees:
                    found_degrees.append(clean_m)

        # Field of study / Major
        major_patterns = [
            r"(?:Computer Science|Software Engineering|Information Technology|Data Science|Artificial Intelligence|Cybersecurity|Electrical Engineering|Mechanical Engineering|Mathematics|Physics|Business Administration)",
        ]
        found_majors = []
        for p in major_patterns:
            matches = re.findall(p, text, re.IGNORECASE)
            for m in matches:
                clean_m = m.strip().title()
                if clean_m not in found_majors:
                    found_majors.append(clean_m)

        return {
            "degrees": found_degrees,
            "majors": found_majors,
            "has_higher_ed": len(found_degrees) > 0
        }
