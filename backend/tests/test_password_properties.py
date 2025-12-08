"""
Property-Based Tests for Password Hashing

Feature: user-authentication-database, Property 1: Password hashing is irreversible
Validates: Requirements 1.3, 9.1

This test verifies that password hashing is irreversible - for any password,
the hash cannot be reversed to obtain the original password, but the correct
password can be verified against the hash.
"""
import pytest
from hypothesis import given, strategies as st, settings
from utils.password import hash_password, verify_password


# Strategy for generating valid passwords (at least 8 characters)
password_strategy = st.text(
    alphabet=st.characters(
        min_codepoint=33,  # Start from '!' to avoid control characters
        max_codepoint=126,  # End at '~' for printable ASCII
        blacklist_categories=('Cs',)  # Exclude surrogates
    ),
    min_size=8,
    max_size=100
)


class TestPasswordHashingProperties:
    """
    Property-based tests for password hashing utilities.
    
    Tests the fundamental property that password hashing is irreversible
    while still allowing verification.
    """
    
    @given(password=password_strategy)
    @settings(max_examples=100, deadline=None)  # Disable deadline for slow bcrypt
    def test_password_hashing_is_irreversible(self, password: str):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: For any password string, hashing it should produce a value
        that cannot be reversed to obtain the original password.
        
        This test verifies:
        1. The hash is different from the original password
        2. The hash cannot be used to retrieve the original password
        3. The correct password can still be verified against the hash
        4. An incorrect password cannot be verified against the hash
        """
        # Hash the password
        hashed = hash_password(password)
        
        # Property 1: Hash should be different from original password
        # (irreversibility - you can't get the password from the hash)
        assert hashed != password, \
            "Hash should not be the same as the original password"
        
        # Property 2: Hash should not contain the original password
        # (even as a substring - ensures no trivial encoding)
        assert password not in hashed, \
            "Hash should not contain the original password as substring"
        
        # Property 3: Correct password should verify successfully
        # (one-way function with verification capability)
        assert verify_password(password, hashed), \
            "Correct password should verify against its hash"
        
        # Property 4: Hash should be a valid bcrypt hash format
        # (starts with $2b$ for bcrypt)
        assert hashed.startswith('$2b$'), \
            "Hash should be in bcrypt format"
        
        # Property 5: Hash should have consistent length (60 chars for bcrypt)
        assert len(hashed) == 60, \
            f"Bcrypt hash should be 60 characters, got {len(hashed)}"
    
    @given(password=password_strategy)
    @settings(max_examples=100, deadline=None)  # Disable deadline for slow bcrypt
    def test_same_password_produces_different_hashes(self, password: str):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: Hashing the same password multiple times should produce
        different hashes (due to salt), but all should verify the same password.
        
        This ensures that:
        1. Salt is being used properly
        2. Each hash is unique (prevents rainbow table attacks)
        3. All hashes verify the same password correctly
        """
        # Hash the same password twice
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        # Property 1: Different hashes for same password (salt working)
        assert hash1 != hash2, \
            "Same password should produce different hashes due to salt"
        
        # Property 2: Both hashes should verify the original password
        assert verify_password(password, hash1), \
            "First hash should verify the password"
        assert verify_password(password, hash2), \
            "Second hash should verify the password"
        
        # Property 3: Neither hash should be the password itself
        assert hash1 != password and hash2 != password, \
            "Hashes should not be the same as the password"
    
    @given(
        password=password_strategy,
        wrong_password=password_strategy
    )
    @settings(max_examples=100, deadline=None)  # Disable deadline for slow bcrypt
    def test_wrong_password_does_not_verify(self, password: str, wrong_password: str):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: For any password and its hash, a different password
        should not verify against that hash.
        
        This ensures that the hash is specific to the password and
        cannot be used to verify incorrect passwords.
        """
        # Skip if passwords happen to be the same
        if password == wrong_password:
            return
        
        # Hash the original password
        hashed = hash_password(password)
        
        # Property: Wrong password should not verify
        assert not verify_password(wrong_password, hashed), \
            "Wrong password should not verify against the hash"
        
        # Property: Correct password should still verify
        assert verify_password(password, hashed), \
            "Correct password should still verify"
    
    @given(password=password_strategy)
    @settings(max_examples=50, deadline=None)  # Disable deadline for slow bcrypt
    def test_hash_is_deterministic_for_verification(self, password: str):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: Once a password is hashed, that hash should consistently
        verify the same password across multiple verification attempts.
        
        This ensures verification is reliable and deterministic.
        """
        # Hash the password once
        hashed = hash_password(password)
        
        # Property: Multiple verifications should all succeed
        for _ in range(5):
            assert verify_password(password, hashed), \
                "Password verification should be consistent"
    
    @given(password=password_strategy)
    @settings(max_examples=50, deadline=None)  # Disable deadline for slow bcrypt
    def test_hash_format_is_consistent(self, password: str):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: All password hashes should follow the bcrypt format consistently,
        ensuring they are properly salted and cannot be reversed.
        """
        # Hash the password
        hashed = hash_password(password)
        
        # Property: Hash should be in bcrypt format
        assert hashed.startswith('$2b$'), \
            "Hash should use bcrypt format"
        
        # Property: Hash should contain salt information
        parts = hashed.split('$')
        assert len(parts) == 4, \
            "Bcrypt hash should have 4 parts: empty, version, cost, salt+hash"
        
        # Property: Cost factor should be present
        assert parts[2].isdigit(), \
            "Cost factor should be numeric"
        
        # Property: Hash should be different from password
        assert hashed != password, \
            "Hash should not be the same as password"
    
    @given(
        password=password_strategy,
        modification=st.integers(min_value=0, max_value=10)
    )
    @settings(max_examples=50, deadline=None)  # Disable deadline for slow bcrypt
    def test_slight_password_change_fails_verification(self, password: str, modification: int):
        """
        **Feature: user-authentication-database, Property 1: Password hashing is irreversible**
        **Validates: Requirements 1.3, 9.1**
        
        Property: Even a slight modification to the password should fail
        verification, demonstrating that the hash is sensitive to the input.
        """
        # Hash the original password
        hashed = hash_password(password)
        
        # Create a slightly modified password
        if len(password) > modification:
            # Change one character
            modified_password = password[:modification] + 'X' + password[modification+1:]
            
            # Skip if modification didn't actually change anything
            if modified_password != password:
                # Property: Modified password should not verify
                assert not verify_password(modified_password, hashed), \
                    "Modified password should not verify against original hash"
                
                # Property: Original password should still verify
                assert verify_password(password, hashed), \
                    "Original password should still verify"


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short"])
