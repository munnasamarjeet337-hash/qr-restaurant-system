import unittest
from unittest.mock import patch
import json
import random
from app import create_app
from app.database import db

class TestAuthAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    @patch('app.services.email_service.EmailService.send_otp_email')
    def test_full_otp_lifecycle_flow(self, mock_send_email):
        # Mock external email dispatch to simulate successful Brevo delivery
        mock_send_email.return_value = (True, "Verification email sent.")

        rand_id = random.randint(10000, 99999)
        test_email = f"candidate_{rand_id}@example.com"
        test_password = "Password@123"

        # 1. Signup -> User created with is_verified: False, OTP stored in DB
        signup_res = self.client.post('/api/auth/signup', json={
            "name": "Alex Morgan",
            "email": test_email,
            "password": test_password,
            "confirm_password": test_password
        })
        self.assertEqual(signup_res.status_code, 201)
        signup_data = json.loads(signup_res.data)
        self.assertTrue(signup_data.get("requires_otp"))
        self.assertNotIn("dev_otp", signup_data) # Confirms zero OTP leakage in API
        self.assertTrue(mock_send_email.called)

        # 2. Login BEFORE verification must be blocked with HTTP 403
        unverified_login_res = self.client.post('/api/auth/login', json={
            "email": test_email,
            "password": test_password
        })
        self.assertEqual(unverified_login_res.status_code, 403)
        self.assertTrue(json.loads(unverified_login_res.data).get("requires_otp"))

        # 3. Wrong OTP must fail with HTTP 400
        wrong_otp_res = self.client.post('/api/auth/verify-otp', json={
            "email": test_email,
            "otp": "000000",
            "purpose": "verification"
        })
        self.assertEqual(wrong_otp_res.status_code, 400)

        # 4. Fetch the real OTP stored securely in the database
        otp_record = db.otp_codes.find_one({"email": test_email, "used": False})
        self.assertIsNotNone(otp_record)
        actual_otp = otp_record["otp"]

        # 5. Verify with valid OTP -> Marks is_verified: True and issues JWT
        verify_res = self.client.post('/api/auth/verify-otp', json={
            "email": test_email,
            "otp": actual_otp,
            "purpose": "verification"
        })
        self.assertEqual(verify_res.status_code, 200)
        verify_data = json.loads(verify_res.data)
        self.assertIn("token", verify_data)
        jwt_token = verify_data["token"]

        # 6. Access protected endpoint /api/auth/me
        me_res = self.client.get('/api/auth/me', headers={
            "Authorization": f"Bearer {jwt_token}"
        })
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(json.loads(me_res.data)["user"]["email"], test_email)

        # 7. Login AFTER verification succeeds with HTTP 200
        login_res = self.client.post('/api/auth/login', json={
            "email": test_email,
            "password": test_password
        })
        self.assertEqual(login_res.status_code, 200)
        self.assertIn("token", json.loads(login_res.data))

if __name__ == '__main__':
    unittest.main()
