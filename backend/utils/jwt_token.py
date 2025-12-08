"""
JWT Token Service

Handles JWT token generation and validation for user authentication.
Uses PyJWT for secure token operations with configurable expiration.
"""
import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from jwt.exceptions import (
    InvalidTokenError,
    ExpiredSignatureError,
    DecodeError,
    InvalidSignatureError
)

logger = logging.getLogger(__name__)


def get_jwt_config() -> Dict[str, Any]:
    """
    Get JWT configuration from environment variables.
    
    Returns:
        dict: JWT configuration with secret_key, algorithm, and expiration_days
    """
    return {
        "secret_key": os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production"),
        "algorithm": os.getenv("JWT_ALGORITHM", "HS256"),
        "expiration_days": int(os.getenv("JWT_EXPIRATION_DAYS", "7"))
    }


def create_access_token(user_id: str, additional_claims: Optional[Dict[str, Any]] = None) -> str:
    """
    Generate a JWT access token for a user.
    
    Args:
        user_id: User's unique identifier
        additional_claims: Optional additional claims to include in token
        
    Returns:
        str: Encoded JWT token
        
    Raises:
        ValueError: If user_id is empty or invalid
        
    Example:
        >>> token = create_access_token("user123")
        >>> print(token)
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    """
    if not user_id:
        raise ValueError("user_id cannot be empty")
    
    if not isinstance(user_id, str):
        raise ValueError("user_id must be a string")
    
    try:
        config = get_jwt_config()
        
        # Calculate expiration time
        expiration = datetime.now(timezone.utc) + timedelta(days=config["expiration_days"])
        
        # Build token payload
        payload = {
            "user_id": user_id,
            "exp": expiration,
            "iat": datetime.now(timezone.utc),  # Issued at
            "type": "access"
        }
        
        # Add any additional claims
        if additional_claims:
            payload.update(additional_claims)
        
        # Encode token
        token = jwt.encode(
            payload,
            config["secret_key"],
            algorithm=config["algorithm"]
        )
        
        logger.info(f"JWT token created for user: {user_id}")
        return token
        
    except Exception as e:
        logger.error(f"Error creating JWT token: {str(e)}")
        raise


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string to verify
        
    Returns:
        dict: Decoded token payload containing user_id and other claims
        
    Raises:
        ExpiredSignatureError: If token has expired
        InvalidTokenError: If token is invalid or tampered with
        
    Example:
        >>> token = create_access_token("user123")
        >>> payload = verify_token(token)
        >>> print(payload["user_id"])
        user123
    """
    if not token:
        raise InvalidTokenError("Token cannot be empty")
    
    if not isinstance(token, str):
        raise InvalidTokenError("Token must be a string")
    
    try:
        config = get_jwt_config()
        
        # Decode and verify token
        payload = jwt.decode(
            token,
            config["secret_key"],
            algorithms=[config["algorithm"]]
        )
        
        # Verify token type
        if payload.get("type") != "access":
            raise InvalidTokenError("Invalid token type")
        
        # Verify user_id exists
        if "user_id" not in payload:
            raise InvalidTokenError("Token missing user_id")
        
        logger.debug(f"JWT token verified for user: {payload['user_id']}")
        return payload
        
    except ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise ExpiredSignatureError("Token has expired")
    
    except InvalidSignatureError:
        logger.error("JWT token has invalid signature")
        raise InvalidTokenError("Invalid token signature")
    
    except DecodeError:
        logger.error("JWT token decode error")
        raise InvalidTokenError("Token decode error")
    
    except Exception as e:
        logger.error(f"Error verifying JWT token: {str(e)}")
        raise InvalidTokenError(f"Token verification failed: {str(e)}")


def decode_token_without_verification(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode a JWT token without verifying its signature.
    
    Useful for inspecting expired tokens or debugging.
    WARNING: Do not use for authentication - always use verify_token()
    
    Args:
        token: JWT token string to decode
        
    Returns:
        dict: Decoded token payload, or None if decode fails
        
    Example:
        >>> token = create_access_token("user123")
        >>> payload = decode_token_without_verification(token)
        >>> print(payload["user_id"])
        user123
    """
    try:
        payload = jwt.decode(
            token,
            options={"verify_signature": False}
        )
        return payload
    except Exception as e:
        logger.error(f"Error decoding token: {str(e)}")
        return None


def get_token_expiration(token: str) -> Optional[datetime]:
    """
    Get the expiration time of a token without full verification.
    
    Args:
        token: JWT token string
        
    Returns:
        datetime: Token expiration time, or None if cannot be determined
    """
    payload = decode_token_without_verification(token)
    if payload and "exp" in payload:
        return datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    return None


def is_token_expired(token: str) -> bool:
    """
    Check if a token is expired without full verification.
    
    Args:
        token: JWT token string
        
    Returns:
        bool: True if expired, False otherwise
    """
    expiration = get_token_expiration(token)
    if expiration:
        return datetime.now(timezone.utc) > expiration
    return True


def extract_user_id(token: str) -> Optional[str]:
    """
    Extract user_id from token without full verification.
    
    Useful for logging or debugging, but should not be used for authentication.
    
    Args:
        token: JWT token string
        
    Returns:
        str: User ID if found, None otherwise
    """
    payload = decode_token_without_verification(token)
    if payload:
        return payload.get("user_id")
    return None


def refresh_token(old_token: str) -> str:
    """
    Create a new token from an existing valid token.
    
    Verifies the old token and creates a new one with updated expiration.
    
    Args:
        old_token: Existing valid JWT token
        
    Returns:
        str: New JWT token with updated expiration
        
    Raises:
        InvalidTokenError: If old token is invalid
        ExpiredSignatureError: If old token has expired
    """
    # Verify the old token
    payload = verify_token(old_token)
    
    # Create new token with same user_id
    user_id = payload["user_id"]
    
    # Preserve any additional claims (except exp, iat, type)
    additional_claims = {
        k: v for k, v in payload.items()
        if k not in ["user_id", "exp", "iat", "type"]
    }
    
    # Create new token
    new_token = create_access_token(user_id, additional_claims)
    
    logger.info(f"JWT token refreshed for user: {user_id}")
    return new_token
