"""
Test script to verify MongoDB connection and JWT configuration
"""
import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

async def test_mongodb_connection():
    """Test MongoDB connection"""
    print("🔍 Testing MongoDB connection...")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DB_NAME")
    
    if not mongodb_uri or "username:password" in mongodb_uri:
        print("❌ MongoDB URI not configured properly in .env file")
        return False
    
    try:
        # Create MongoDB client
        client = AsyncIOMotorClient(mongodb_uri)
        
        # Test connection by pinging the database
        await client.admin.command('ping')
        
        print(f"✅ Successfully connected to MongoDB!")
        print(f"   Database: {db_name}")
        
        # List databases to confirm access
        db_list = await client.list_database_names()
        print(f"   Available databases: {', '.join(db_list)}")
        
        # Close connection
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False

def test_jwt_configuration():
    """Test JWT configuration"""
    print("\n🔍 Testing JWT configuration...")
    
    jwt_secret = os.getenv("JWT_SECRET_KEY")
    jwt_algorithm = os.getenv("JWT_ALGORITHM")
    jwt_expiration = os.getenv("JWT_EXPIRATION_DAYS")
    
    if not jwt_secret or jwt_secret == "dev-secret-key-change-in-production-use-openssl-rand-hex-32":
        print("⚠️  Warning: Using default JWT secret key. Generate a strong key for production!")
    else:
        print(f"✅ JWT secret key configured (length: {len(jwt_secret)} characters)")
    
    print(f"   Algorithm: {jwt_algorithm}")
    print(f"   Expiration: {jwt_expiration} days")
    
    # Test JWT token generation and validation
    try:
        test_payload = {
            "user_id": "test_user_123",
            "exp": datetime.utcnow() + timedelta(days=int(jwt_expiration))
        }
        
        # Generate token
        token = jwt.encode(test_payload, jwt_secret, algorithm=jwt_algorithm)
        print(f"✅ JWT token generated successfully")
        
        # Validate token
        decoded = jwt.decode(token, jwt_secret, algorithms=[jwt_algorithm])
        print(f"✅ JWT token validated successfully")
        print(f"   Decoded user_id: {decoded['user_id']}")
        
        return True
        
    except Exception as e:
        print(f"❌ JWT test failed: {str(e)}")
        return False

def test_bcrypt_configuration():
    """Test bcrypt configuration"""
    print("\n🔍 Testing bcrypt configuration...")
    
    import bcrypt
    
    bcrypt_rounds = int(os.getenv("BCRYPT_ROUNDS", 12))
    print(f"   Bcrypt rounds: {bcrypt_rounds}")
    
    try:
        # Test password hashing
        test_password = "test_password_123"
        hashed = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt(rounds=bcrypt_rounds))
        print(f"✅ Password hashing successful")
        
        # Test password verification
        is_valid = bcrypt.checkpw(test_password.encode('utf-8'), hashed)
        if is_valid:
            print(f"✅ Password verification successful")
            return True
        else:
            print(f"❌ Password verification failed")
            return False
            
    except Exception as e:
        print(f"❌ Bcrypt test failed: {str(e)}")
        return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("🚀 InsightSphere AI - Configuration Test")
    print("=" * 60)
    
    # Test MongoDB
    mongodb_ok = await test_mongodb_connection()
    
    # Test JWT
    jwt_ok = test_jwt_configuration()
    
    # Test bcrypt
    bcrypt_ok = test_bcrypt_configuration()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    print(f"MongoDB Connection: {'✅ PASS' if mongodb_ok else '❌ FAIL'}")
    print(f"JWT Configuration:  {'✅ PASS' if jwt_ok else '❌ FAIL'}")
    print(f"Bcrypt Configuration: {'✅ PASS' if bcrypt_ok else '❌ FAIL'}")
    
    if mongodb_ok and jwt_ok and bcrypt_ok:
        print("\n🎉 All tests passed! You're ready to proceed with Task 2.")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues before proceeding.")
    
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
