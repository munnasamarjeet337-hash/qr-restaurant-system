import sys
import os
from dotenv import load_dotenv

# Ensure backend root in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
load_dotenv()

from app import create_app
from app.services.email_service import EmailService

def test_dispatch(target_email="test.candidate@example.com"):
    print("\n" + "="*70)
    print(">>> RESUMEIQ BREVO TRANSACTIONAL EMAIL DIAGNOSTIC TEST")
    print("="*70)

    app = create_app()
    with app.app_context():
        brevo_key = os.getenv('BREVO_API_KEY', '').strip()
        sender_email = os.getenv('BREVO_SENDER_EMAIL', 'noreply@resumeiq.ai').strip()
        sender_name = os.getenv('BREVO_SENDER_NAME', 'ResumeIQ').strip()

        print(f"\n[Configuration Status]")
        print(f" * Brevo API Key:      {'Configured (' + brevo_key[:10] + '...)' if brevo_key else '[NOT SET]'}")
        print(f" * Sender Email:       {sender_email}")
        print(f" * Sender Name:        {sender_name}")
        print(f" * Target Recipient:   {target_email}\n")

        if not brevo_key:
            print(" [FAILED] BREVO_API_KEY is missing in backend/.env!")
            print(" Please sign up at https://brevo.com, copy your API key (starts with xkeysib-...),")
            print(" add BREVO_API_KEY=xkeysib-... to backend/.env, and re-run this script.\n")
            print("="*70 + "\n")
            return False

        otp_code = EmailService.generate_otp()
        print(f"Generated 6-digit test OTP: {otp_code}")
        print("Dispatching transactional email via Brevo REST API (https://api.brevo.com/v3/smtp/email)...")

        success, message = EmailService.send_otp_email(target_email, otp_code, purpose="verification")
        
        print("\n" + "-"*70)
        if success:
            print(f" Result: SUCCESS!")
            print(f" Message: {message}")
            print(f" >> Check {target_email} inbox for email with subject 'Your ResumeIQ verification code'")
        else:
            print(f" Result: FAILED")
            print(f" Reason: {message}")
        print("="*70 + "\n")
        return success

if __name__ == '__main__':
    recipient = sys.argv[1] if len(sys.argv) > 1 else "test.user@example.com"
    test_dispatch(recipient)
