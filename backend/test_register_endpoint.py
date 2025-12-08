"""
Test script for registration endpoint
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

async def test_register_endpoint():
    """Test the registration endpoint"""
    print("=" * 60)
    print("🧪 Testing POST /api/auth/register Endpoint")
    print("=" * 60)
    
    async with httpx.AsyncClient() as client:
        try:
            # Test 1: Successful registration
            print("\n1️⃣ Testing successful registration...")
            register_data = {
                "email": "testuser@example.com",
                "name": "Test User",
                "password": "TestPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=register_data
            )
            
            if response.status_code == 201:
                data = response.json()
                print("✅ Registration successful")
                print(f"   Status: {response.status_code}")
                print(f"   User ID: {data['user']['_id']}")
                print(f"   Email: {data['user']['email']}")
                print(f"   Name: {data['user']['name']}")
                print(f"   Token: {data['access_token'][:50]}...")
                print(f"   Token Type: {data['token_type']}")
                
                user_id = data['user']['_id']
            else:
                print(f"❌ Registration failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return
            
            # Test 2: Duplicate email
            print("\n2️⃣ Testing duplicate email prevention...")
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=register_data
            )
            
            if response.status_code == 409:
                print("✅ Duplicate email correctly rejected")
                print(f"   Status: {response.status_code}")
                print(f"   Message: {response.json()['detail']}")
            else:
                print(f"❌ Duplicate email was accepted: {response.status_code}")
            
            # Test 3: Invalid email format
            print("\n3️⃣ Testing invalid email format...")
            invalid_email_data = {
                "email": "not-an-email",
                "name": "Test User",
                "password": "TestPassword123"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=invalid_email_data
            )
            
            if response.status_code == 422:
                print("✅ Invalid email format rejected")
                print(f"   Status: {response.status_code}")
            else:
                print(f"❌ Invalid email was accepted: {response.status_code}")
            
            # Test 4: Weak password
            print("\n4️⃣ Testing weak password...")
            weak_password_data = {
                "email": "another@example.com",
                "name": "Test User",
                "password": "weak"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=weak_password_data
            )
            
            if response.status_code == 422:
                print("✅ Weak password rejected")
                print(f"   Status: {response.status_code}")
            else:
                print(f"❌ Weak password was accepted: {response.status_code}")
            
            # Test 5: Missing fields
            print("\n5️⃣ Testing missing required fields...")
            incomplete_data = {
                "email": "test@example.com"
            }
            
            response = await client.post(
                f"{BASE_URL}/api/auth/register",
                json=incomplete_data
            )
            
            if response.status_code == 422:
                print("✅ Missing fields rejected")
                print(f"   Status: {response.status_code}")
            else:
                print(f"❌ Incomplete data was accepted: {response.status_code}")
            
            # Cleanup: Delete test user
            print("\n6️⃣ Cleaning up test user...")
            from database import init_database, close_database
            from repositories.user_repository import user_repository
            
            await init_database()
            deleted = await user_repository.delete_user(user_id)
            await close_database()
            
            if deleted:
                print("✅ Test user deleted")
            
            print("\n" + "=" * 60)
            print("✅ All registration endpoint tests completed!")
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
    
    asyncio.run(test_register_endpoint())
