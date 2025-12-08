"""
Password hashing and verification utilities.

Uses bcrypt for secure password hashing with configurable rounds.
"""
import os
import logging
import bcrypt

logger = logging.getLogger(__name__)


def get_bcrypt_rounds() -> int:
    """
    Get bcrypt rounds from environment variable.
    
    Returns:
        int: Number of bcrypt rounds (default: 12)
    """
    try:
        rounds = int(os.getenv("BCRYPT_ROUNDS", "12"))
        # Validate rounds (bcrypt supports 4-31)
        if rounds < 4 or rounds > 31:
            logger.warning(f"Invalid BCRYPT_ROUNDS value: {rounds}. Using default: 12")
            return 12
        return rounds
    except ValueError:
        logger.warning("Invalid BCRYPT_ROUNDS format. Using default: 12")
        return 12


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        str: Hashed password (bcrypt hash as string)
        
    Raises:
        ValueError: If password is empty or invalid
        
    Example:
        >>> hashed = hash_password("MySecurePassword123")
        >>> print(hashed)
        $2b$12$...
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    if not isinstance(password, str):
        raise ValueError("Password must be a string")
    
    try:
        # Get bcrypt rounds from environment
        rounds = get_bcrypt_rounds()
        
        # Generate salt and hash password
        salt = bcrypt.gensalt(rounds=rounds)
        password_bytes = password.encode('utf-8')
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Return as string
        return hashed.decode('utf-8')
        
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against
        
    Returns:
        bool: True if password matches, False otherwise
        
    Example:
        >>> hashed = hash_password("MyPassword123")
        >>> verify_password("MyPassword123", hashed)
        True
        >>> verify_password("WrongPassword", hashed)
        False
    """
    if not plain_password or not hashed_password:
        return False
    
    if not isinstance(plain_password, str) or not isinstance(hashed_password, str):
        return False
    
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        
        # Verify password
        return bcrypt.checkpw(password_bytes, hashed_bytes)
        
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False


def is_password_strong(password: str) -> tuple[bool, list[str]]:
    """
    Check if a password meets strength requirements.
    
    Requirements:
    - At least 8 characters long
    - Contains at least one uppercase letter (optional but recommended)
    - Contains at least one lowercase letter (optional but recommended)
    - Contains at least one digit (optional but recommended)
    
    Args:
        password: Password to check
        
    Returns:
        tuple: (is_strong: bool, issues: list[str])
        
    Example:
        >>> is_password_strong("weak")
        (False, ['Password must be at least 8 characters long'])
        >>> is_password_strong("StrongPass123")
        (True, [])
    """
    issues = []
    
    if not password:
        issues.append("Password cannot be empty")
        return False, issues
    
    # Check minimum length (required)
    if len(password) < 8:
        issues.append("Password must be at least 8 characters long")
    
    # Check for uppercase (recommended)
    if not any(c.isupper() for c in password):
        issues.append("Password should contain at least one uppercase letter (recommended)")
    
    # Check for lowercase (recommended)
    if not any(c.islower() for c in password):
        issues.append("Password should contain at least one lowercase letter (recommended)")
    
    # Check for digit (recommended)
    if not any(c.isdigit() for c in password):
        issues.append("Password should contain at least one digit (recommended)")
    
    # Password is strong if it meets the minimum length requirement
    # Other requirements are recommendations
    is_strong = len(password) >= 8
    
    return is_strong, issues
