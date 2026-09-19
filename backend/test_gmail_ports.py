import smtplib
import ssl

email_user = "c81samarjeet@gmail.com"
app_pass = "ldesdkmtendtkymi"

print("--- Testing Port 587 (STARTTLS) ---")
try:
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
        context = ssl.create_default_context()
        server.starttls(context=context)
        server.login(email_user, app_pass)
        print(">> SUCCESS on Port 587!")
except Exception as e:
    print(f">> Error on 587: {e}")

print("\n--- Testing Port 465 (SSL) ---")
try:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=10) as server:
        server.login(email_user, app_pass)
        print(">> SUCCESS on Port 465!")
except Exception as e:
    print(f">> Error on 465: {e}")
