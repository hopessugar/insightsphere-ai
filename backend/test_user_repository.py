"""
Test script for user model and repository
"""
import asyncio
import logging
from dotenv import load_dotenv
from database import init_database, close_database
from models.user import UserCreate, UserUpdate
from repositories.user_repository import user_repository
import bcrypt

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def test_user_repository():
    """Test user repository operations"""
    print("=" * 60)
    print("🧪 Testing User Model and Repository")
    print("=" * 60)
    
    try:
        # Initialize database
        print("\n1️⃣ Initializing database...")
        await init_database()
        
        # Test 1: Create user
        print("\n2️⃣ Testing user creation...")
        test_user = UserCreate(
            email="test@example.com",
            name="Test User",
            password="TestPassword123"
        )
        
        # Hash password
        password_hash = bcrypt.hashpw(
            test_user.password.encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')
        
        created_user = await user_repository.create_user(test_user, password_hash)
        print(f"✅ User created: {created_user.email} (ID: {created_user.id})")
        user_id = created_user.id
        
        # Test 2: Get user by email
        print("\n3️⃣ Testing get user by email...")
        found_user = await user_repository.get_user_by_email("test@example.com")
        if found_user:
            print(f"✅ User found by email: {found_user.name}")
        else:
            print("❌ User not found by email")
        
        # Test 3: Get user by ID
        print("\n4️⃣ Testing get user by ID...")
        found_user = await user_repository.get_user_by_id(user_id)
        if found_user:
            print(f"✅ User found by ID: {found_user.name}")
        else:
            print("❌ User not found by ID")
        
        # Test 4: Email uniqueness validation
        print("\n5️⃣ Testing email uniqueness...")
        email_exists = await user_repository.email_exists("test@example.com")
        print(f"✅ Email exists check: {email_exists}")
        
        # Test 5: Try to create duplicate user
        print("\n6️⃣ Testing duplicate email prevention...")
        try:
            duplicate_user = UserCreate(
                email="test@example.com",
                name="Duplicate User",
                password="AnotherPassword123"
            )
            await user_repository.create_user(duplicate_user, password_hash)
            print("❌ Duplicate user created (should have failed)")
        except Exception as e:
            print(f"✅ Duplicate email rejected: {type(e).__name__}")
        
        # Test 6: Update user
        print("\n7️⃣ Testing user update...")
        updates = UserUpdate(name="Updated Test User")
        updated_user = await user_repository.update_user(user_id, updates)
        if updated_user:
            print(f"✅ User updated: {updated_user.name}")
        else:
            print("❌ User update failed")
        
        # Test 7: Update last login
        print("\n8️⃣ Testing last login update...")
        success = await user_repository.update_last_login(user_id)
        if success:
            print("✅ Last login updated")
            # Verify update
            user = await user_repository.get_user_by_id(user_id)
            print(f"   Last login: {user.last_login}")
        else:
            print("❌ Last login update failed")
        
        # Test 8: Update password
        print("\n9️⃣ Testing password update...")
        new_password_hash = bcrypt.hashpw(
            "NewPassword456".encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')
        success = await user_repository.update_password(user_id, new_password_hash)
        if success:
            print("✅ Password updated")
        else:
            print("❌ Password update failed")
        
        # Test 9: Delete user
        print("\n🔟 Testing user deletion...")
        success = await user_repository.delete_user(user_id)
        if success:
            print("✅ User deleted")
            # Verify deletion
            deleted_user = await user_repository.get_user_by_id(user_id)
            if deleted_user is None:
                print("✅ User deletion verified")
            else:
                print("❌ User still exists after deletion")
        else:
            print("❌ User deletion failed")
        
        print("\n" + "=" * 60)
        print("✅ All user repository tests completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up
        await close_database()

if __name__ == "__main__":
    asyncio.run(test_user_repository())
