import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'resumeiq-secret-key-dev-default-32chars')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'resumeiq-jwt-session-secret-key-default')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # MongoDB Connection URI
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/resumeiq')
    DB_NAME = os.getenv('DB_NAME', 'resumeiq')
    
    # Brevo Transactional Email Configuration
    BREVO_API_KEY = os.getenv('BREVO_API_KEY', '').strip()
    BREVO_SENDER_EMAIL = os.getenv('BREVO_SENDER_EMAIL', os.getenv('EMAIL_USER', 'onboarding@resumeiq.ai')).strip()
    BREVO_SENDER_NAME = os.getenv('BREVO_SENDER_NAME', 'ResumeIQ').strip()

    # CORS Allowed Origins
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    
    # Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, os.getenv('UPLOAD_FOLDER', 'uploads'))
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 5 * 1024 * 1024)) # 5 MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}
