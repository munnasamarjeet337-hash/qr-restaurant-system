import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    brevo_key = os.getenv('BREVO_API_KEY', '').strip()

    if not brevo_key:
        print("\n" + "!" * 70)
        print(" [WARNING] BREVO_API_KEY not set in backend/.env!")
        print(" Real transactional OTP emails will fail until BREVO_API_KEY is configured.")
        print(" Get a free key at https://brevo.com and add BREVO_API_KEY=xkeysib-... to .env")
        print("!" * 70 + "\n")
    else:
        print(f"[ResumeIQ] Brevo API configured (Key: {brevo_key[:8]}...)")

    port = int(os.environ.get('PORT', 5000))
    print(f"[ResumeIQ] Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
