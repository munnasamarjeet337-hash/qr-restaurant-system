import functools
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from app.database import db

def generate_jwt(user_id, email, role="user"):
    payload = {
        "user_id": str(user_id),
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(days=7)),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config.get('JWT_SECRET_KEY'), algorithm="HS256")

def decode_jwt(token):
    try:
        return jwt.decode(token, current_app.config.get('JWT_SECRET_KEY'), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required(optional=False, role=None):
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            token = None
            
            # 1. Try Bearer header
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1].strip()
                
            # 2. Try httpOnly Cookie
            if not token:
                token = request.cookies.get('resumeiq_token')

            if not token:
                if optional:
                    request.current_user = None
                    return f(*args, **kwargs)
                return jsonify({"error": "Authentication token missing. Please log in."}), 401

            payload = decode_jwt(token)
            if not payload:
                if optional:
                    request.current_user = None
                    return f(*args, **kwargs)
                return jsonify({"error": "Invalid or expired session token. Please log in again."}), 401

            # Fetch fresh user
            user = db.users.find_one({"_id": payload["user_id"]})
            if not user:
                # Try finding by email
                user = db.users.find_one({"email": payload["email"]})

            if not user:
                return jsonify({"error": "User account no longer exists."}), 401

            # Check role if required
            if role and user.get('role') != role and user.get('role') != 'admin':
                return jsonify({"error": "Forbidden: Administrative access required."}), 403

            request.current_user = user
            return f(*args, **kwargs)
        return wrapper
    return decorator
