"""
Authentication API Routes

Provides REST API endpoints for user authentication operations.
"""
from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel
from typing import Optional
import logging

from models.user import UserCreate, UserResponse, UserLogin
from services.auth_service import (
    auth_service,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    TokenExpiredError,
    InvalidTokenError
)

logger = logging.getLogger(__name__)

# Create router for authentication endpoints
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class AuthResponse(BaseModel):
    """Response model for authentication (register/login)"""
    user: UserResponse
    access_token: str
    token_type: str = "bearer"
    
    class Config:
        json_schema_extra = {
            "example": {
                "user": {
                    "_id": "507f1f77bcf86cd799439011",
                    "email": "user@example.com",
                    "name": "John Doe",
                    "created_at": "2024-01-01T00:00:00Z",
                    "last_login": "2024-01-02T00:00:00Z",
                    "profile": {
                        "avatar_url": None,
                        "preferences": {
                            "theme": "light",
                            "notifications": True
                        }
                    }
                },
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }


class LogoutResponse(BaseModel):
    """Response model for logout"""
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Successfully logged out"
            }
        }


def extract_token_from_header(authorization: Optional[str]) -> str:
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
            detail="Authorization header missing"
        )
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )
    
    return parts[1]


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
    description="""
    Register a new user account with email and password.
    
    - **email**: Valid email address (must be unique)
    - **name**: User's full name
    - **password**: Password (minimum 8 characters)
    
    Returns the created user and an access token for immediate login.
    """,
    responses={
        201: {
            "description": "User successfully registered",
            "model": AuthResponse
        },
        409: {
            "description": "Email already exists",
            "content": {
                "application/json": {
                    "example": {"detail": "User with email user@example.com already exists"}
                }
            }
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid email format"}
                }
            }
        }
    }
)
async def register(user_data: UserCreate):
    """
    Register a new user account.
    
    Validates email format and password strength, checks for duplicate emails,
    hashes the password, creates the user in the database, and generates a JWT token.
    """
    try:
        logger.info(f"Registration request received for: {user_data.email}")
        
        # Register user through auth service
        user, access_token = await auth_service.register_user(user_data)
        
        # Convert to response model (exclude password_hash)
        user_response = UserResponse(
            _id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            last_login=user.last_login,
            profile=user.profile
        )
        
        logger.info(f"✅ User registered successfully: {user.email}")
        
        return AuthResponse(
            user=user_response,
            access_token=access_token,
            token_type="bearer"
        )
        
    except UserAlreadyExistsError as e:
        logger.warning(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again."
        )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login to user account",
    description="""
    Authenticate a user with email and password.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns the user data and an access token for authenticated requests.
    Updates the user's last_login timestamp.
    """,
    responses={
        200: {
            "description": "User successfully authenticated",
            "model": AuthResponse
        },
        401: {
            "description": "Invalid credentials",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid email or password"}
                }
            }
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid email format"}
                }
            }
        }
    }
)
async def login(credentials: UserLogin):
    """
    Login to user account.
    
    Validates credentials, verifies password hash, generates JWT token,
    and updates the last_login timestamp.
    """
    try:
        logger.info(f"Login request received for: {credentials.email}")
        
        # Authenticate user through auth service
        user, access_token = await auth_service.authenticate_user(credentials)
        
        # Convert to response model (exclude password_hash)
        user_response = UserResponse(
            _id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            last_login=user.last_login,
            profile=user.profile
        )
        
        logger.info(f"✅ User logged in successfully: {user.email}")
        
        return AuthResponse(
            user=user_response,
            access_token=access_token,
            token_type="bearer"
        )
        
    except InvalidCredentialsError as e:
        logger.warning(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )



@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Logout from user account",
    description="""
    Logout a user by validating their JWT token.
    
    The client should remove the token from local storage after receiving this response.
    Since JWTs are stateless, the actual logout is handled client-side.
    
    Requires Authorization header with Bearer token.
    """,
    responses={
        200: {
            "description": "Successfully logged out",
            "model": LogoutResponse
        },
        401: {
            "description": "Invalid or missing token",
            "content": {
                "application/json": {
                    "example": {"detail": "Authorization header missing"}
                }
            }
        }
    }
)
async def logout(authorization: Optional[str] = Header(None)):
    """
    Logout from user account.
    
    Validates the JWT token and returns a success response.
    The client is responsible for removing the token from storage.
    """
    try:
        # Extract token from Authorization header
        token = extract_token_from_header(authorization)
        
        # Verify token is valid
        user = await auth_service.verify_token(token)
        
        logger.info(f"✅ User logged out successfully: {user.email}")
        
        return LogoutResponse(
            message="Successfully logged out"
        )
        
    except TokenExpiredError:
        logger.warning("Logout failed: Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    
    except InvalidTokenError as e:
        logger.warning(f"Logout failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions (from extract_token_from_header)
        raise
    
    except Exception as e:
        logger.error(f"Logout error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed. Please try again."
        )



@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="""
    Retrieve the current authenticated user's profile information.
    
    Requires Authorization header with Bearer token.
    """,
    responses={
        200: {
            "description": "User profile retrieved successfully",
            "model": UserResponse
        },
        401: {
            "description": "Invalid or missing token",
            "content": {
                "application/json": {
                    "example": {"detail": "Authorization header missing"}
                }
            }
        }
    }
)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get current authenticated user's profile.
    
    Validates the JWT token and returns the user's profile information.
    """
    try:
        # Extract token from Authorization header
        token = extract_token_from_header(authorization)
        
        # Verify token and get user
        user = await auth_service.verify_token(token)
        
        # Convert to response model (exclude password_hash)
        user_response = UserResponse(
            _id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            last_login=user.last_login,
            profile=user.profile
        )
        
        logger.info(f"✅ User profile retrieved: {user.email}")
        
        return user_response
        
    except TokenExpiredError:
        logger.warning("Get profile failed: Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    
    except InvalidTokenError as e:
        logger.warning(f"Get profile failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions (from extract_token_from_header)
        raise
    
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile. Please try again."
        )



@router.put(
    "/profile",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user profile",
    description="""
    Update the current authenticated user's profile information.
    
    Allows updating:
    - name
    - profile.avatar_url
    - profile.preferences.theme
    - profile.preferences.notifications
    
    Requires Authorization header with Bearer token.
    """,
    responses={
        200: {
            "description": "Profile updated successfully",
            "model": UserResponse
        },
        401: {
            "description": "Invalid or missing token",
            "content": {
                "application/json": {
                    "example": {"detail": "Authorization header missing"}
                }
            }
        },
        422: {
            "description": "Validation error",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid data"}
                }
            }
        }
    }
)
async def update_profile(
    update_data: dict,
    authorization: Optional[str] = Header(None)
):
    """
    Update user profile.
    
    Validates the JWT token, updates allowed fields, and returns updated profile.
    """
    try:
        # Extract token from Authorization header
        token = extract_token_from_header(authorization)
        
        # Verify token and get user
        user = await auth_service.verify_token(token)
        
        # Import here to avoid circular dependency
        from models.user import UserUpdate
        from repositories.user_repository import user_repository
        
        # Create update model
        user_update = UserUpdate(**update_data)
        
        # Update user in database
        updated_user = await user_repository.update_user(user.id, user_update)
        
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Convert to response model (exclude password_hash)
        user_response = UserResponse(
            _id=updated_user.id,
            email=updated_user.email,
            name=updated_user.name,
            created_at=updated_user.created_at,
            last_login=updated_user.last_login,
            profile=updated_user.profile
        )
        
        logger.info(f"✅ User profile updated: {updated_user.email}")
        
        return user_response
        
    except TokenExpiredError:
        logger.warning("Update profile failed: Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    
    except InvalidTokenError as e:
        logger.warning(f"Update profile failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Update profile error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile. Please try again."
        )
