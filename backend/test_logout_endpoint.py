"""
Test POST /api/auth/logout endpoint

Tests the logout endpoint functionality including:
- Successful logout with valid token
- Failed logout with invalid token
- Failed logout with missing token
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


async def test_logout_endpoint():
    """Test the logout endpoint"""
    print("=" * 60)
    print("🧪 Testing POST /api/auth/logout Endpoint")
    print("=" * 60)
    
    async with httpx.AsyncClient() as client:
        try:
            # Setup: Register and login to get a valid token
            print("\n0️⃣ Setting up test user and getting token...")
            register_data = {
                "email": "logouttest@example.com",
                "name": "Logout Test User",
                "password": "TestPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=register_data
            )
            
            if response.status_code == 201:
                data = response.json()
                access_token = data['access_token']
                user_id = data['user']['_id']
                print("✅ Test user created and logged in")
                print(f"   Token: {access_token[:50]}...")
            elif response.status_code == 409:
                # User already exists, login instead
                print("✅ Test user already exists, logging in...")
                response = await client.post(
                    f"{BASE_URL}/api/auth/login",
                    json={
                        "email": "logouttest@example.com",
                        "password": "TestPassword123"
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    access_token = data['access_token']
                    user_id = data['user']['_id']
                    print(f"   Token: {access_token[:50]}...")
                else:
                    print("❌ Could not login to existing user")
                    return
            else:
                print(f"❌ Failed to create test user: {response.status_code}")
                print(f"   Response: {response.text}")
                return
            
            # Test 1: Successful logout with valid token
            print("\n1️⃣ Testing successful logout with valid token...")
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/logout",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Logout successful")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {data['message']}")
            else:
                print(f"❌ Logout failed: {response.status_code}")
                print(f"   Response: {response.text}")
            
            # Test 2: Logout with invalid token
            print("\n2️⃣ Testing logout with invalid token...")
            invalid_headers = {
                "Authorization": "Bearer invalid_token_here"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/logout",
                headers=invalid_headers
            )
            
            if response.status_code == 401:
                print("✅ Invalid token correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Invalid token was accepted: {response.status_code}")
            
            # Test 3: Logout with missing Authorization header
            print("\n3️⃣ Testing logout with missing Authorization header...")
            
            response = await client.post(
                f"{BASE_URL}/api/auth/logout"
            )
            
            if response.status_code == 401:
                print("✅ Missing authorization header correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Missing header was accepted: {response.status_code}")
            
            # Test 4: Logout with malformed Authorization header
            print("\n4️⃣ Testing logout with malformed Authorization header...")
            malformed_headers = {
                "Authorization": "InvalidFormat token123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/logout",
                headers=malformed_headers
            )
            
            if response.status_code == 401:
                print("✅ Malformed authorization header correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Malformed header was accepted: {response.status_code}")
            
            # Test 5: Logout with expired token (we'll use the same token, it should still work)
            print("\n5️⃣ Testing logout with token (should still be valid)...")
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/logout",
                headers=headers
            )
            
            if response.status_code == 200:
                print("✅ Token still valid for logout")
                print(f"   Status: {response.status_code}")
            else:
                print(f"⚠️  Token validation status: {response.status_code}")
            
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
            print("✅ All logout endpoint tests completed!")
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
    
    asyncio.run(test_logout_endpoint())
