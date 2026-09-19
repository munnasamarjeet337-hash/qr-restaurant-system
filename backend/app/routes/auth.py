import re
from datetime import datetime, timezone
import bcrypt
from flask import Blueprint, request, jsonify, make_response
from app.database import db
from app.services.email_service import EmailService
from app.utils.auth_middleware import generate_jwt, jwt_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required."}), 400

    if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email):
        return jsonify({"error": "Invalid email address format."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    if confirm_password and password != confirm_password:
        return jsonify({"error": "Passwords do not match."}), 400

    # Check if user already exists
    existing = db.users.find_one({"email": email})
    if existing:
        if existing.get('is_verified', False):
            return jsonify({"error": "An account with this email already exists. Please log in."}), 409
        else:
            # Re-send verification OTP for unverified existing user
            otp = EmailService.create_and_store_otp(email, purpose="verification")
            sent_success, send_msg = EmailService.send_otp_email(email, otp, purpose="verification")
            if not sent_success:
                return jsonify({"error": f"Failed to send verification email: {send_msg}"}), 500
            
            return jsonify({
                "message": "Account already registered but unverified. A new verification code has been sent to your email inbox.",
                "email": email,
                "requires_otp": True
            }), 200

    # Hash password
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    # Create unverified user
    user_doc = {
        "name": name,
        "email": email,
        "password_hash": pw_hash,
        "role": "user",
        "is_verified": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db.users.insert_one(user_doc)

    # Generate & send OTP via Brevo
    otp = EmailService.create_and_store_otp(email, purpose="verification")
    sent_success, send_msg = EmailService.send_otp_email(email, otp, purpose="verification")
    if not sent_success:
        return jsonify({"error": f"Failed to send verification email: {send_msg}"}), 500

    return jsonify({
        "message": "Registration successful! A 6-digit verification code has been sent to your email inbox.",
        "email": email,
        "requires_otp": True
    }), 201


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    otp = data.get('otp', '').strip()
    purpose = data.get('purpose', 'verification')

    if not email or not otp:
        return jsonify({"error": "Email and 6-digit OTP code are required."}), 400

    success, msg = EmailService.verify_otp(email, otp, purpose=purpose)
    if not success:
        return jsonify({"error": msg}), 400

    if purpose == "verification":
        # Mark user as verified
        db.users.update_one({"email": email}, {"$set": {"is_verified": True}})
        user = db.users.find_one({"email": email})
        
        token = generate_jwt(user.get('_id'), email, role=user.get('role', 'user'))
        
        resp_data = {
            "message": "Email verified successfully! Welcome to ResumeIQ.",
            "token": token,
            "user": {
                "id": str(user.get('_id')),
                "name": user.get('name'),
                "email": user.get('email'),
                "role": user.get('role', 'user')
            }
        }
        resp = make_response(jsonify(resp_data))
        resp.set_cookie('resumeiq_token', token, httponly=True, samesite='Lax', max_age=7*24*3600)
        return resp, 200

    elif purpose == "reset_password":
        return jsonify({"message": "OTP verified. You may now set your new password.", "verified": True}), 200


@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    purpose = data.get('purpose', 'verification')

    if not email:
        return jsonify({"error": "Email is required."}), 400

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "No account found with this email."}), 404

    otp = EmailService.create_and_store_otp(email, purpose=purpose)
    sent_success, send_msg = EmailService.send_otp_email(email, otp, purpose=purpose)
    if not sent_success:
        return jsonify({"error": f"Failed to send email: {send_msg}"}), 500

    return jsonify({
        "message": "A fresh 6-digit verification code has been sent to your email inbox.",
        "email": email
    }), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user.get('password_hash', '').encode('utf-8')):
        return jsonify({"error": "Invalid email or password."}), 401

    # Block login if user is unverified
    if not user.get('is_verified', False):
        otp = EmailService.create_and_store_otp(email, purpose="verification")
        sent_success, send_msg = EmailService.send_otp_email(email, otp, purpose="verification")
        if not sent_success:
            return jsonify({"error": f"Account email is not verified, and sending OTP failed: {send_msg}"}), 500

        return jsonify({
            "error": "Your email is not yet verified. A new 6-digit verification code has been sent to your inbox.",
            "requires_otp": True,
            "email": email
        }), 403

    token = generate_jwt(user.get('_id'), email, role=user.get('role', 'user'))

    resp_data = {
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": str(user.get('_id')),
            "name": user.get('name'),
            "email": user.get('email'),
            "role": user.get('role', 'user')
        }
    }
    resp = make_response(jsonify(resp_data))
    resp.set_cookie('resumeiq_token', token, httponly=True, samesite='Lax', max_age=7*24*3600)
    return resp, 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({"error": "Email is required."}), 400

    user = db.users.find_one({"email": email})
    if not user:
        # Prevent email enumeration by returning a standard success message
        return jsonify({"message": "If an account exists with this email, a verification code has been sent."}), 200

    otp = EmailService.create_and_store_otp(email, purpose="reset_password")
    sent_success, send_msg = EmailService.send_otp_email(email, otp, purpose="reset_password")
    if not sent_success:
        return jsonify({"error": f"Failed to send reset code: {send_msg}"}), 500

    return jsonify({
        "message": "Password reset code has been sent to your email inbox.",
        "email": email
    }), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    otp = data.get('otp', '').strip()
    new_password = data.get('new_password', '')

    if not email or not otp or not new_password:
        return jsonify({"error": "Email, 6-digit OTP code, and new password are required."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    # Verify OTP first
    success, msg = EmailService.verify_otp(email, otp, purpose="reset_password")
    if not success:
        return jsonify({"error": msg}), 400

    # Hash new password and update user
    salt = bcrypt.gensalt()
    pw_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')
    
    db.users.update_one({"email": email}, {"$set": {"password_hash": pw_hash, "is_verified": True}})

    return jsonify({"message": "Password updated successfully! You may now log in with your new password."}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    u = request.current_user
    return jsonify({
        "user": {
            "id": str(u.get('_id')),
            "name": u.get('name'),
            "email": u.get('email'),
            "role": u.get('role', 'user'),
            "created_at": u.get('created_at')
        }
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({"message": "Logged out successfully."}))
    resp.set_cookie('resumeiq_token', '', expires=0)
    return resp, 200
