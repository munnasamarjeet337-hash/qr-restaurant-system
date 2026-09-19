import requests
import json

res = requests.post("http://127.0.0.1:5000/api/auth/signup", json={
    "name": "Test Candidate",
    "email": "test_real_smtp@gmail.com",
    "password": "Password123",
    "confirm_password": "Password123"
})

print(f"Status Code: {res.status_code}")
print(f"Response Body: {json.dumps(res.json(), indent=2)}")
