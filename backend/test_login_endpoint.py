"""
Test POST /api/auth/login endpoint

Tests the login endpoint functionality including:
- Successful login with valid credentials
- Failed login with invalid credentials
- Failed login with non-existent user
"""
import asyncio
import httpx
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

BASE_URL = "http://localhost:8000"


async def test_login_endpoint():
    """Test the login endpoint"""
    print("=" * 60)
    print("🧪 Testing POST /api/auth/login Endpoint")
    print("=" * 60)
    
    async with httpx.AsyncClient() as client:
        try:
            # First, register a test user
            print("\n0️⃣ Setting up test user...")
            register_data = {
                "email": "logintest@example.com",
                "name": "Login Test User",
                "password": "TestPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=register_data
            )
            
            if response.status_code == 201:
                data = response.json()
                print("✅ Test user created")
                print(f"   User ID: {data['user']['_id']}")
                user_id = data['user']['_id']
            elif response.status_code == 409:
                # User already exists, that's okay
                print("✅ Test user already exists")
                # Get user_id by logging in
                response = await client.post(
                    f"{BASE_URL}/api/auth/login",
                    json={
                        "email": "logintest@example.com",
                        "password": "TestPassword123"
                    }
                )
                if response.status_code == 200:
                    user_id = response.json()['user']['_id']
                else:
                    print("❌ Could not get existing user")
                    return
            else:
                print(f"❌ Failed to create test user: {response.status_code}")
                print(f"   Response: {response.text}")
                return
            
            # Test 1: Successful login
            print("\n1️⃣ Testing successful login with valid credentials...")
            login_data = {
                "email": "logintest@example.com",
                "password": "TestPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json=login_data
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Login successful")
                print(f"   Status: {response.status_code}")
                print(f"   User ID: {data['user']['_id']}")
                print(f"   Email: {data['user']['email']}")
                print(f"   Name: {data['user']['name']}")
                print(f"   Token: {data['access_token'][:50]}...")
                print(f"   Token Type: {data['token_type']}")
                print(f"   Last Login: {data['user']['last_login']}")
                
                # Verify password_hash is not exposed
                assert 'password_hash' not in data['user'], "❌ Password hash exposed!"
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return
            
            # Test 2: Invalid password
            print("\n2️⃣ Testing login with invalid password...")
            invalid_password_data = {
                "email": "logintest@example.com",
                "password": "WrongPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json=invalid_password_data
            )
            
            if response.status_code == 401:
                print("✅ Invalid password correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Invalid password was accepted: {response.status_code}")
            
            # Test 3: Non-existent user
            print("\n3️⃣ Testing login with non-existent user...")
            nonexistent_data = {
                "email": "nonexistent@example.com",
                "password": "SomePassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json=nonexistent_data
            )
            
            if response.status_code == 401:
                print("✅ Non-existent user correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Non-existent user was accepted: {response.status_code}")
            
            # Test 4: Invalid email format
            print("\n4️⃣ Testing login with invalid email format...")
            invalid_email_data = {
                "email": "not-an-email",
                "password": "SomePassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json=invalid_email_data
            )
            
            if response.status_code == 422:
                print("✅ Invalid email format rejected")
                print(f"   Status: {response.status_code}")
            else:
                print(f"❌ Invalid email was accepted: {response.status_code}")
            
            # Test 5: Missing fields
            print("\n5️⃣ Testing login with missing required fields...")
            
            # Missing password
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": "test@example.com"}
            )
            
            if response.status_code == 422:
                print("✅ Missing password rejected")
            else:
                print(f"❌ Missing password was accepted: {response.status_code}")
            
            # Missing email
            response = await client.post(
                f"{BASE_URL}/api/auth/login",
                json={"password": "TestPassword123"}
            )
            
            if response.status_code == 422:
                print("✅ Missing email rejected")
            else:
                print(f"❌ Missing email was accepted: {response.status_code}")
            
            # Cleanup: Delete test user
            print("\n6️⃣ Cleaning up test user...")
            from database.connection import db_manager
            from repositories.user_repository import user_repository
            
            await db_manager.connect()
            deleted = await user_repository.delete_user(user_id)
            await db_manager.disconnect()
            
            if deleted:
                print("✅ Test user deleted")
            
            print("\n" + "=" * 60)
            print("✅ All login endpoint tests completed!")
            print("=" * 60)
            
        except httpx.ConnectError:
            print("\n❌ Could not connect to server")
            print("   Make sure the backend is running:")
            print("   cd backend && python app.py")
        
        except Exception as e:
            print(f"\n❌ Test failed: {str(e)}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    print("\n⚠️  Make sure the backend server is running before running this test!")
    print("   Run: cd backend && python app.py")
    print("\nPress Enter to continue...")
    input()
    
    asyncio.run(test_login_endpoint())
