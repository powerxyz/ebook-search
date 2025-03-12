import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_register():
    url = f'{BASE_URL}/auth/register'
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123'
    }
    response = requests.post(url, json=data)
    print('Register Response:', response.status_code)
    print(response.json())

def test_login():
    url = f'{BASE_URL}/auth/login'
    data = {
        'username': 'testuser',
        'password': 'testpass123'
    }
    response = requests.post(url, json=data)
    print('Login Response:', response.status_code)
    print(response.json())
    return response.json().get('access_token')

def main():
    print("Testing registration...")
    test_register()
    
    print("\nTesting login...")
    test_login()

if __name__ == '__main__':
    main() 