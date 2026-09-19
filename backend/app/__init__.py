import os
import re
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from app.config import Config
from app.database import db
from app.routes.auth import auth_bp
from app.routes.resume import resume_bp
from app.routes.jobs import jobs_bp
from app.routes.admin import admin_bp

def create_app(config_class=Config):
    # Locate React frontend dist directory (in backend/dist, ../frontend/dist, or ./frontend/dist)
    base_dir = os.path.abspath(os.path.dirname(__file__))
    possible_dist_dirs = [
        os.path.join(base_dir, '..', 'dist'),
        os.path.join(base_dir, '..', '..', 'frontend', 'dist'),
        os.path.join(base_dir, '..', '..', 'dist'),
        os.path.join(os.getcwd(), 'frontend', 'dist'),
        os.path.join(os.getcwd(), 'dist'),
    ]

    dist_dir = None
    for p in possible_dist_dirs:
        norm_p = os.path.abspath(p)
        if os.path.exists(norm_p) and os.path.exists(os.path.join(norm_p, 'index.html')):
            dist_dir = norm_p
            break

    if not dist_dir:
        dist_dir = os.path.abspath(os.path.join(base_dir, '..', 'dist'))

    app = Flask(__name__, static_folder=dist_dir, static_url_path='')
    app.config.from_object(config_class)

    # Enable CORS for local dev and external domains
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Initialize extensions
    db.init_app(app)

    # Register API Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(admin_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "ResumeIQ Full-Stack API",
            "version": "1.0.0",
            "database_mode": "MongoDB" if db.is_mongo else "Local Document Store"
        }), 200

    # Catch-all route to serve the React Single Page App (SPA)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path):
        if path.startswith('api/'):
            return jsonify({"error": "API endpoint not found."}), 404
        
        file_path = os.path.join(dist_dir, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(dist_dir, path)
        
        index_file = os.path.join(dist_dir, 'index.html')
        if os.path.exists(index_file):
            return send_from_directory(dist_dir, 'index.html')
        
        return "ResumeIQ UI is building. Please refresh in a moment.", 200

    @app.errorhandler(413)
    def file_too_large(e):
        return jsonify({"error": "File size exceeds the 5MB maximum limit."}), 413

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "An internal server error occurred."}), 500

    return app
