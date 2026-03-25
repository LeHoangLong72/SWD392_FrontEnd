import requests
import json

BASE_URL = "http://localhost:5195"

# Register
reg_data = {
    "username": "testuser_py",
    "email": "testpy@test.com",
    "password": "Test@123456789"
}

print("Registering...")
reg_resp = requests.post(f"{BASE_URL}/api/account/register", json=reg_data)
if reg_resp.status_code == 200:
    user_data = reg_resp.json()
    token = user_data.get("token")
    print(f"✓ Registered. Token: {token[:30]}...")
    
    # Start lesson
    headers = {"Authorization": f"Bearer {token}"}
    print("\nStarting lesson 1...")
    lesson_resp = requests.post(f"{BASE_URL}/api/lesson-attempt/start/1", headers=headers)
    
    if lesson_resp.status_code == 200:
        lesson_data = lesson_resp.json()
        print(f"✓ Lesson started")
        print(f"  Attempt ID: {lesson_data.get('attemptId')}")
        print(f"  Questions: {len(lesson_data.get('questions', []))}")
        
        if lesson_data.get('questions'):
            q = lesson_data['questions'][0]
            print(f"\n  First Question:")
            print(f"    Content: {q.get('content')}")
            print(f"    Options: {len(q.get('options', []))}")
            for i, opt in enumerate(q.get('options', []), 1):
                print(f"      {i}. {opt.get('optionText')} (ID: {opt.get('optionId')})")
    else:
        print(f"✗ Error: {lesson_resp.status_code}")
        print(lesson_resp.text)
else:
    print(f"✗ Registration failed: {reg_resp.status_code}")
    print(reg_resp.text)
