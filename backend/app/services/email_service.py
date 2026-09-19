import os
import random
import string
import requests
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from flask import current_app
from app.database import db

class EmailService:
    @staticmethod
    def generate_otp():
        """Generates a secure 6-digit numeric OTP."""
        return ''.join(random.choices(string.digits, k=6))

    @staticmethod
    def create_and_store_otp(email, purpose="verification"):
        """Invalidates existing OTPs for the email/purpose and creates a new 5-min TTL OTP."""
        email_clean = str(email).strip().lower()
        otp = EmailService.generate_otp()
        expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
        
        # Invalidate previous unused OTPs
        db.otp_codes.delete_many({"email": email_clean, "purpose": purpose})
        
        db.otp_codes.insert_one({
            "email": email_clean,
            "otp": otp,
            "purpose": purpose,
            "expires_at": expiry.isoformat(),
            "used": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return otp

    @staticmethod
    def verify_otp(email, otp, purpose="verification"):
        """Validates the OTP code against database record and expiration timestamp."""
        email_clean = str(email).strip().lower()
        record = db.otp_codes.find_one({
            "email": email_clean,
            "otp": str(otp).strip(),
            "purpose": purpose,
            "used": False
        })
        
        if not record:
            return False, "Invalid or expired OTP code. Please check your email or request a new code."
            
        expires_at_str = record.get('expires_at')
        try:
            expires_at = datetime.fromisoformat(expires_at_str)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            now_utc = datetime.now(timezone.utc)
            if now_utc > expires_at:
                return False, "This OTP code has expired (5-minute limit). Please request a new one."
        except Exception as e:
            print(f"[EmailService] Expiration parse warning: {e}")
            
        # Invalidate code upon successful verification
        db.otp_codes.update_one({"_id": record['_id']}, {"$set": {"used": True}})
        return True, "Verification successful."

    @staticmethod
    def get_email_template(otp, purpose="verification"):
        """Generates modern, responsive HTML and plain-text email templates."""
        is_verification = purpose == "verification"
        action_title = "Verify Your ResumeIQ Account" if is_verification else "Reset Your ResumeIQ Password"
        headline = "Your ResumeIQ verification code" if is_verification else "Reset Your ResumeIQ Password"
        intro_text = (
            "Thank you for joining <strong>ResumeIQ</strong>. To complete your account verification and access your ATS score analysis, enter the 6-digit code below:"
            if is_verification
            else "We received a request to reset your <strong>ResumeIQ</strong> account password. Enter the verification code below to proceed:"
        )

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{action_title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #312E81 0%, #4338CA 50%, #4F46E5 100%); padding: 32px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.15); padding: 8px 18px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.25);">
                      <span style="font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">ResumeIQ</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 13px; font-weight: 500; color: #E0E7FF; letter-spacing: 0.5px;">AI Resume Analyzer & Job Recommendation System</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0F172A; text-align: center;">
                {headline}
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                {intro_text}
              </p>
              <div style="background: #F1F5F9; border-radius: 16px; border: 2px dashed #818CF8; padding: 24px; text-align: center; margin-bottom: 28px;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <div style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #4338CA; font-family: 'Courier New', Courier, monospace; padding: 6px 0;">
                  {otp}
                </div>
                <div style="display: inline-block; margin-top: 10px; padding: 4px 14px; background: #FEF3C7; border-radius: 20px; border: 1px solid #FDE68A;">
                  <span style="font-size: 12px; font-weight: 700; color: #92400E;">⏱ Valid for 5 minutes</span>
                </div>
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; padding: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.5; color: #64748B;">
                    <strong>Security Reminder:</strong> Never share this code with anyone. ResumeIQ will never ask for your verification code. If you did not initiate this request, you can safely ignore this email.
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; color: #64748B; text-align: center;">
                Questions? Contact us at <a href="mailto:support@resumeiq.ai" style="color: #4F46E5; font-weight: 600; text-decoration: none;">support@resumeiq.ai</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748B;">
                ResumeIQ &bull; Transparent AI for Job Seekers
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                &copy; {datetime.now().year} ResumeIQ. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

        plain_text = f"""
ResumeIQ - {action_title}
==================================================

{intro_text}

Your 6-Digit OTP Code is: {otp}

(This code is valid for 5 minutes)

Security Notice: Never share this code with anyone. If you did not request this code, you can safely ignore this email.

---
ResumeIQ - AI Resume Analyzer & Job Recommendation System
"""
        return html_content, plain_text

    @staticmethod
    def send_otp_email(to_email, otp, purpose="verification"):
        """
        Dispatches OTP email via Resend API or Brevo Transactional Email API.
        """
        to_email_clean = str(to_email).strip().lower()
        subject = "Your ResumeIQ verification code" if purpose == "verification" else "Your ResumeIQ password reset code"
        html_content, plain_text = EmailService.get_email_template(otp, purpose=purpose)

        # 1. Check Resend API (Instant, no manual review required)
        resend_key = os.getenv('RESEND_API_KEY', '').strip()
        if resend_key:
            try:
                url = "https://api.resend.com/emails"
                headers = {
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "from": "ResumeIQ <onboarding@resend.dev>",
                    "to": [to_email_clean],
                    "subject": subject,
                    "html": html_content,
                    "text": plain_text
                }
                response = requests.post(url, json=payload, headers=headers, timeout=12)
                if response.status_code in [200, 201]:
                    print(f"[EmailService] Real OTP email delivered to {to_email_clean} via Resend API (ID: {response.json().get('id')}).")
                    return True, "Verification email sent to your inbox."
                else:
                    print(f"[EmailService] Resend API error {response.status_code}: {response.text}")
            except Exception as e:
                print(f"[EmailService] Resend API exception: {e}")

        # 2. Check Brevo REST API
        brevo_key = os.getenv('BREVO_API_KEY', '').strip()
        sender_email = os.getenv('BREVO_SENDER_EMAIL', 'c81samarjeet@gmail.com').strip()
        sender_name = os.getenv('BREVO_SENDER_NAME', 'ResumeIQ').strip()

        if brevo_key:
            try:
                url = "https://api.brevo.com/v3/smtp/email"
                headers = {
                    "accept": "application/json",
                    "api-key": brevo_key,
                    "content-type": "application/json"
                }
                payload = {
                    "sender": {"name": sender_name, "email": sender_email},
                    "to": [{"email": to_email_clean}],
                    "subject": subject,
                    "htmlContent": html_content,
                    "textContent": plain_text
                }
                response = requests.post(url, json=payload, headers=headers, timeout=12)
                if response.status_code in [200, 201, 202]:
                    print(f"[EmailService] Real OTP email delivered to {to_email_clean} via Brevo API.")
                    return True, "Verification email sent to your inbox."
                else:
                    error_detail = response.json().get('message', response.text)
                    print(f"[EmailService] Brevo API status {response.status_code}: {error_detail}")
                    if "not yet activated" in error_detail.lower():
                        return False, f"Brevo account pending activation: {error_detail}"
            except Exception as e:
                print(f"[EmailService] Brevo API exception: {e}")

        return False, "Email provider not active or credentials unverified. Check your provider activation."
