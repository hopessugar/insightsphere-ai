"""
Test script for password hashing utilities
"""
import logging
from dotenv import load_dotenv
from utils.password import hash_password, verify_password, is_password_strong

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_password_utilities():
    """Test password hashing and verification"""
    print("=" * 60)
    print("🧪 Testing Password Hashing Utilities")
    print("=" * 60)
    
    try:
        # Test 1: Hash password
        print("\n1️⃣ Testing password hashing...")
        test_password = "MySecurePassword123"
        hashed = hash_password(test_password)
        print(f"✅ Password hashed successfully")
        print(f"   Original: {test_password}")
        print(f"   Hashed: {hashed[:30]}...")
        print(f"   Hash length: {len(hashed)} characters")
        
        # Test 2: Verify correct password
        print("\n2️⃣ Testing password verification (correct password)...")
        is_valid = verify_password(test_password, hashed)
        if is_valid:
            print("✅ Correct password verified successfully")
        else:
            print("❌ Correct password verification failed")
        
        # Test 3: Verify incorrect password
        print("\n3️⃣ Testing password verification (incorrect password)...")
        is_valid = verify_password("WrongPassword123", hashed)
        if not is_valid:
            print("✅ Incorrect password correctly rejected")
        else:
            print("❌ Incorrect password was accepted (should fail)")
        
        # Test 4: Hash uniqueness (same password, different hashes)
        print("\n4️⃣ Testing hash uniqueness...")
        hashed2 = hash_password(test_password)
        if hashed != hashed2:
            print("✅ Same password produces different hashes (salt working)")
            print(f"   Hash 1: {hashed[:30]}...")
            print(f"   Hash 2: {hashed2[:30]}...")
        else:
            print("❌ Same password produced identical hashes")
        
        # Test 5: Both hashes verify correctly
        print("\n5️⃣ Testing both hashes verify the same password...")
        valid1 = verify_password(test_password, hashed)
        valid2 = verify_password(test_password, hashed2)
        if valid1 and valid2:
            print("✅ Both hashes verify the same password correctly")
        else:
            print("❌ Hash verification inconsistent")
        
        # Test 6: Password strength validation
        print("\n6️⃣ Testing password strength validation...")
        
        # Weak password
        weak_pass = "weak"
        is_strong, issues = is_password_strong(weak_pass)
        print(f"\n   Password: '{weak_pass}'")
        print(f"   Strong: {is_strong}")
        if issues:
            print(f"   Issues: {', '.join(issues)}")
        if not is_strong:
            print("   ✅ Weak password correctly identified")
        
        # Strong password
        strong_pass = "StrongPassword123"
        is_strong, issues = is_password_strong(strong_pass)
        print(f"\n   Password: '{strong_pass}'")
        print(f"   Strong: {is_strong}")
        if issues:
            print(f"   Issues: {', '.join(issues)}")
        if is_strong:
            print("   ✅ Strong password correctly identified")
        
        # Minimum length password
        min_pass = "12345678"
        is_strong, issues = is_password_strong(min_pass)
        print(f"\n   Password: '{min_pass}'")
        print(f"   Strong: {is_strong}")
        if issues:
            print(f"   Issues: {', '.join(issues)}")
        if is_strong:
            print("   ✅ Minimum length password accepted")
        
        # Test 7: Empty password handling
        print("\n7️⃣ Testing empty password handling...")
        try:
            hash_password("")
            print("❌ Empty password was accepted (should fail)")
        except ValueError as e:
            print(f"✅ Empty password correctly rejected: {str(e)}")
        
        # Test 8: Invalid password type
        print("\n8️⃣ Testing invalid password type...")
        try:
            hash_password(None)
            print("❌ None password was accepted (should fail)")
        except (ValueError, AttributeError) as e:
            print(f"✅ None password correctly rejected")
        
        # Test 9: Verify with empty hash
        print("\n9️⃣ Testing verification with empty hash...")
        is_valid = verify_password("test", "")
        if not is_valid:
            print("✅ Empty hash correctly rejected")
        else:
            print("❌ Empty hash was accepted")
        
        # Test 10: Performance test
        print("\n🔟 Testing hashing performance...")
        import time
        start = time.time()
        for i in range(5):
            hash_password(f"TestPassword{i}")
        end = time.time()
        avg_time = (end - start) / 5
        print(f"✅ Average hashing time: {avg_time:.3f} seconds")
        if avg_time < 1.0:
            print("   ✅ Performance acceptable (< 1 second per hash)")
        else:
            print("   ⚠️  Performance slow (> 1 second per hash)")
        
        print("\n" + "=" * 60)
        print("✅ All password utility tests completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_password_utilities()
