"""
Test script for JWT token service
"""
import time
import logging
from dotenv import load_dotenv
from utils.jwt_token import (
    create_access_token,
    verify_token,
    refresh_token,
    decode_token_without_verification,
    get_token_expiration,
    is_token_expired,
    extract_user_id
)
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_jwt_service():
    """Test JWT token service operations"""
    print("=" * 60)
    print("🧪 Testing JWT Token Service")
    print("=" * 60)
    
    try:
        # Test 1: Create token
        print("\n1️⃣ Testing token creation...")
        user_id = "test_user_123"
        token = create_access_token(user_id)
        print(f"✅ Token created successfully")
        print(f"   User ID: {user_id}")
        print(f"   Token: {token[:50]}...")
        print(f"   Token length: {len(token)} characters")
        
        # Test 2: Verify token
        print("\n2️⃣ Testing token verification...")
        payload = verify_token(token)
        print(f"✅ Token verified successfully")
        print(f"   User ID from token: {payload['user_id']}")
        print(f"   Token type: {payload.get('type')}")
        print(f"   Issued at: {payload.get('iat')}")
        print(f"   Expires at: {payload.get('exp')}")
        
        # Test 3: Verify user_id matches
        print("\n3️⃣ Testing user_id consistency...")
        if payload['user_id'] == user_id:
            print("✅ User ID matches original")
        else:
            print("❌ User ID mismatch")
        
        # Test 4: Token with additional claims
        print("\n4️⃣ Testing token with additional claims...")
        additional_claims = {
            "email": "test@example.com",
            "role": "user"
        }
        token_with_claims = create_access_token(user_id, additional_claims)
        payload_with_claims = verify_token(token_with_claims)
        print(f"✅ Token with claims created and verified")
        print(f"   Email: {payload_with_claims.get('email')}")
        print(f"   Role: {payload_with_claims.get('role')}")
        
        # Test 5: Extract user_id without verification
        print("\n5️⃣ Testing user_id extraction...")
        extracted_id = extract_user_id(token)
        if extracted_id == user_id:
            print(f"✅ User ID extracted: {extracted_id}")
        else:
            print("❌ User ID extraction failed")
        
        # Test 6: Get token expiration
        print("\n6️⃣ Testing token expiration retrieval...")
        expiration = get_token_expiration(token)
        if expiration:
            print(f"✅ Token expiration: {expiration}")
            print(f"   Days until expiration: {(expiration - expiration.now(expiration.tzinfo)).days}")
        else:
            print("❌ Could not get expiration")
        
        # Test 7: Check if token is expired
        print("\n7️⃣ Testing token expiration check...")
        is_expired = is_token_expired(token)
        if not is_expired:
            print("✅ Token is not expired (as expected)")
        else:
            print("❌ Token shows as expired (should not be)")
        
        # Test 8: Decode without verification
        print("\n8️⃣ Testing decode without verification...")
        decoded = decode_token_without_verification(token)
        if decoded and decoded['user_id'] == user_id:
            print("✅ Token decoded without verification")
            print(f"   User ID: {decoded['user_id']}")
        else:
            print("❌ Decode without verification failed")
        
        # Test 9: Refresh token
        print("\n9️⃣ Testing token refresh...")
        time.sleep(1)  # Wait a second to ensure different iat
        new_token = refresh_token(token)
        new_payload = verify_token(new_token)
        print(f"✅ Token refreshed successfully")
        print(f"   Old token: {token[:30]}...")
        print(f"   New token: {new_token[:30]}...")
        print(f"   User ID preserved: {new_payload['user_id'] == user_id}")
        
        # Test 10: Invalid token handling
        print("\n🔟 Testing invalid token handling...")
        try:
            verify_token("invalid.token.here")
            print("❌ Invalid token was accepted (should fail)")
        except InvalidTokenError:
            print("✅ Invalid token correctly rejected")
        
        # Test 11: Empty token handling
        print("\n1️⃣1️⃣ Testing empty token handling...")
        try:
            verify_token("")
            print("❌ Empty token was accepted (should fail)")
        except InvalidTokenError:
            print("✅ Empty token correctly rejected")
        
        # Test 12: Tampered token handling
        print("\n1️⃣2️⃣ Testing tampered token handling...")
        try:
            # Tamper with the token by changing a character
            tampered_token = token[:-5] + "XXXXX"
            verify_token(tampered_token)
            print("❌ Tampered token was accepted (should fail)")
        except InvalidTokenError:
            print("✅ Tampered token correctly rejected")
        
        # Test 13: Empty user_id handling
        print("\n1️⃣3️⃣ Testing empty user_id handling...")
        try:
            create_access_token("")
            print("❌ Empty user_id was accepted (should fail)")
        except ValueError as e:
            print(f"✅ Empty user_id correctly rejected: {str(e)}")
        
        # Test 14: Multiple tokens for same user
        print("\n1️⃣4️⃣ Testing multiple tokens for same user...")
        token1 = create_access_token(user_id)
        time.sleep(0.01)  # Small delay to ensure different iat
        token2 = create_access_token(user_id)
        if token1 != token2:
            print("✅ Different tokens generated for same user (different timestamps)")
            payload1 = verify_token(token1)
            payload2 = verify_token(token2)
            if payload1['user_id'] == payload2['user_id']:
                print("✅ Both tokens verify to same user")
        else:
            print("⚠️  Same token generated (created at exact same time)")
        
        print("\n" + "=" * 60)
        print("✅ All JWT token service tests completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_jwt_service()
