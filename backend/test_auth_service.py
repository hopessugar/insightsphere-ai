"""
Test script for authentication service
"""
import asyncio
import logging
from dotenv import load_dotenv
from database import init_database, close_database
from models.user import UserCreate, UserLogin
from services.auth_service import (
    auth_service,
    InvalidCredentialsError,
    UserAlreadyExistsError,
    TokenExpiredError
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def test_auth_service():
    """Test authentication service operations"""
    print("=" * 60)
    print("🧪 Testing Authentication Service")
    print("=" * 60)
    
    try:
        # Initialize database
        print("\n1️⃣ Initializing database...")
        await init_database()
        
        # Test 1: Register new user
        print("\n2️⃣ Testing user registration...")
        test_user = UserCreate(
            email="authtest@example.com",
            name="Auth Test User",
            password="TestPassword123"
        )
        
        user, token = await auth_service.register_user(test_user)
        print(f"✅ User registered successfully")
        print(f"   Email: {user.email}")
        print(f"   Name: {user.name}")
        print(f"   User ID: {user.id}")
        print(f"   Token: {token[:50]}...")
        
        user_id = user.id
        
        # Test 2: Duplicate registration
        print("\n3️⃣ Testing duplicate registration prevention...")
        try:
            await auth_service.register_user(test_user)
            print("❌ Duplicate registration was allowed (should fail)")
        except UserAlreadyExistsError as e:
            print(f"✅ Duplicate registration prevented: {str(e)}")
        
        # Test 3: User authentication (login)
        print("\n4️⃣ Testing user authentication...")
        credentials = UserLogin(
            email="authtest@example.com",
            password="TestPassword123"
        )
        
        auth_user, auth_token = await auth_service.authenticate_user(credentials)
        print(f"✅ User authenticated successfully")
        print(f"   Email: {auth_user.email}")
        print(f"   Token: {auth_token[:50]}...")
        
        # Test 4: Invalid password
        print("\n5️⃣ Testing invalid password...")
        try:
            bad_credentials = UserLogin(
                email="authtest@example.com",
                password="WrongPassword"
            )
            await auth_service.authenticate_user(bad_credentials)
            print("❌ Invalid password was accepted (should fail)")
        except InvalidCredentialsError:
            print("✅ Invalid password correctly rejected")
        
        # Test 5: Non-existent user
        print("\n6️⃣ Testing non-existent user login...")
        try:
            fake_credentials = UserLogin(
                email="nonexistent@example.com",
                password="SomePassword123"
            )
            await auth_service.authenticate_user(fake_credentials)
            print("❌ Non-existent user login was allowed (should fail)")
        except InvalidCredentialsError:
            print("✅ Non-existent user login correctly rejected")
        
        # Test 6: Token verification
        print("\n7️⃣ Testing token verification...")
        verified_user = await auth_service.verify_token(token)
        print(f"✅ Token verified successfully")
        print(f"   User ID: {verified_user.id}")
        print(f"   Email: {verified_user.email}")
        
        # Test 7: Get current user
        print("\n8️⃣ Testing get current user...")
        current_user = await auth_service.get_current_user(token)
        if current_user.id == user_id:
            print(f"✅ Current user retrieved: {current_user.email}")
        else:
            print("❌ Current user mismatch")
        
        # Test 8: Invalid token
        print("\n9️⃣ Testing invalid token...")
        try:
            await auth_service.verify_token("invalid.token.here")
            print("❌ Invalid token was accepted (should fail)")
        except Exception:
            print("✅ Invalid token correctly rejected")
        
        # Test 9: Create access token
        print("\n🔟 Testing access token creation...")
        new_token = auth_service.create_access_token(
            user_id,
            {"custom_claim": "test_value"}
        )
        print(f"✅ Access token created: {new_token[:50]}...")
        
        # Test 10: Change password
        print("\n1️⃣1️⃣ Testing password change...")
        success = await auth_service.change_password(
            user_id,
            "TestPassword123",
            "NewPassword456"
        )
        if success:
            print("✅ Password changed successfully")
            
            # Verify old password no longer works
            try:
                old_creds = UserLogin(
                    email="authtest@example.com",
                    password="TestPassword123"
                )
                await auth_service.authenticate_user(old_creds)
                print("❌ Old password still works (should fail)")
            except InvalidCredentialsError:
                print("✅ Old password no longer works")
            
            # Verify new password works
            new_creds = UserLogin(
                email="authtest@example.com",
                password="NewPassword456"
            )
            new_auth_user, _ = await auth_service.authenticate_user(new_creds)
            print(f"✅ New password works: {new_auth_user.email}")
        else:
            print("❌ Password change failed")
        
        # Test 11: Change password with wrong current password
        print("\n1️⃣2️⃣ Testing password change with wrong current password...")
        try:
            await auth_service.change_password(
                user_id,
                "WrongCurrentPassword",
                "AnotherNewPassword"
            )
            print("❌ Password change with wrong current password was allowed")
        except InvalidCredentialsError:
            print("✅ Password change with wrong current password rejected")
        
        # Cleanup: Delete test user
        print("\n1️⃣3️⃣ Cleaning up test user...")
        from repositories.user_repository import user_repository
        deleted = await user_repository.delete_user(user_id)
        if deleted:
            print("✅ Test user deleted")
        
        print("\n" + "=" * 60)
        print("✅ All authentication service tests completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close database
        await close_database()

if __name__ == "__main__":
    asyncio.run(test_auth_service())
