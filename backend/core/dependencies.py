"""
FastAPI Dependencies

Provides reusable dependencies for request handling, including authentication.
"""
from fastapi import Depends, HTTPException, status, Header
from typing import Optional
import logging

from models.user import UserInDB
from services.auth_service import auth_service, TokenExpiredError, InvalidTokenError

logger = logging.getLogger(__name__)


def extract_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract JWT token from Authorization header.
    
    Args:
        authorization: Authorization header value (e.g., "Bearer <token>")
        
    Returns:
        str: Extracted JWT token
        
    Raises:
        HTTPException: If header is missing or malformed
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return parts[1]


async def get_current_user(
    token: str = Depends(extract_token_from_header)
) -> UserInDB:
    """
    FastAPI dependency to get the current authenticated user.
    
    Validates JWT token and retrieves user from database.
    
    Args:
        token: JWT token extracted from Authorization header
        
    Returns:
        UserInDB: Current authenticated user
        
    Raises:
        HTTPException: If token is invalid or expired
        
    Example:
        @router.get("/protected")
        async def protected_route(current_user: UserInDB = Depends(get_current_user)):
            return {"user_id": current_user.id}
    """
    try:
        # Verify token and get user
        user = await auth_service.verify_token(token)
        return user
        
    except TokenExpiredError:
        logger.warning("Authentication failed: Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    except InvalidTokenError as e:
        logger.warning(f"Authentication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def get_current_user_id(
    current_user: UserInDB = Depends(get_current_user)
) -> str:
    """
    FastAPI dependency to get the current user's ID.
    
    Convenience dependency that returns just the user ID.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        str: User's unique identifier
        
    Example:
        @router.get("/my-data")
        async def get_my_data(user_id: str = Depends(get_current_user_id)):
            return {"user_id": user_id}
    """
    return current_user.id
