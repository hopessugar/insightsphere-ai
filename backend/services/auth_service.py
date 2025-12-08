"""
Authentication Service

Handles user authentication operations including registration, login,
and token management. Integrates password hashing, JWT tokens, and user repository.
"""
import logging
from typing import Optional, Tuple
from datetime import datetime

from models.user import UserCreate, UserInDB, UserLogin
from repositories.user_repository import user_repository
from utils.password import hash_password, verify_password
from utils.jwt_token import create_access_token, verify_token
from pymongo.errors import DuplicateKeyError
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError

logger = logging.getLogger(__name__)


class AuthenticationError(Exception):
    """Base exception for authentication errors"""
    pass


class InvalidCredentialsError(AuthenticationError):
    """Raised when login credentials are invalid"""
    pass


class UserAlreadyExistsError(AuthenticationError):
    """Raised when attempting to register with existing email"""
    pass


class TokenExpiredError(AuthenticationError):
    """Raised when token has expired"""
    pass


class InvalidTokenError(AuthenticationError):
    """Raised when token is invalid"""
    pass


class AuthService:
    """
    Authentication service for user management and token operations.
    
    Provides methods for user registration, authentication, and token management.
    """
    
    def __init__(self):
        """Initialize authentication service"""
        self.user_repo = user_repository
    
    async def register_user(self, user_data: UserCreate) -> Tuple[UserInDB, str]:
        """
        Register a new user account.
        
        Args:
            user_data: User registration data (email, name, password)
            
        Returns:
            tuple: (created_user, access_token)
            
        Raises:
            UserAlreadyExistsError: If email already exists
            ValueError: If user data is invalid
            
        Example:
            >>> user_data = UserCreate(
            ...     email="user@example.com",
            ...     name="John Doe",
            ...     password="SecurePass123"
            ... )
            >>> user, token = await auth_service.register_user(user_data)
        """
        try:
            logger.info(f"Attempting to register user: {user_data.email}")
            
            # Check if email already exists
            existing_user = await self.user_repo.get_user_by_email(user_data.email)
            if existing_user:
                logger.warning(f"Registration failed: Email already exists: {user_data.email}")
                raise UserAlreadyExistsError(f"User with email {user_data.email} already exists")
            
            # Hash password
            password_hash = hash_password(user_data.password)
            
            # Create user in database
            created_user = await self.user_repo.create_user(user_data, password_hash)
            
            # Generate access token
            access_token = create_access_token(
                user_id=created_user.id,
                additional_claims={
                    "email": created_user.email,
                    "name": created_user.name
                }
            )
            
            logger.info(f"✅ User registered successfully: {created_user.email}")
            return created_user, access_token
            
        except DuplicateKeyError:
            logger.warning(f"Registration failed: Duplicate email: {user_data.email}")
            raise UserAlreadyExistsError(f"User with email {user_data.email} already exists")
        
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise
    
    async def authenticate_user(self, credentials: UserLogin) -> Tuple[UserInDB, str]:
        """
        Authenticate a user and generate access token.
        
        Args:
            credentials: User login credentials (email, password)
            
        Returns:
            tuple: (authenticated_user, access_token)
            
        Raises:
            InvalidCredentialsError: If credentials are invalid
            
        Example:
            >>> credentials = UserLogin(
            ...     email="user@example.com",
            ...     password="SecurePass123"
            ... )
            >>> user, token = await auth_service.authenticate_user(credentials)
        """
        try:
            logger.info(f"Authentication attempt for: {credentials.email}")
            
            # Get user by email
            user = await self.user_repo.get_user_by_email(credentials.email)
            if not user:
                logger.warning(f"Authentication failed: User not found: {credentials.email}")
                raise InvalidCredentialsError("Invalid email or password")
            
            # Verify password
            if not verify_password(credentials.password, user.password_hash):
                logger.warning(f"Authentication failed: Invalid password for: {credentials.email}")
                raise InvalidCredentialsError("Invalid email or password")
            
            # Update last login timestamp
            await self.user_repo.update_last_login(user.id)
            
            # Generate access token
            access_token = create_access_token(
                user_id=user.id,
                additional_claims={
                    "email": user.email,
                    "name": user.name
                }
            )
            
            logger.info(f"✅ User authenticated successfully: {user.email}")
            return user, access_token
            
        except InvalidCredentialsError:
            raise
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise
    
    def create_access_token(self, user_id: str, additional_claims: Optional[dict] = None) -> str:
        """
        Create a JWT access token for a user.
        
        Args:
            user_id: User's unique identifier
            additional_claims: Optional additional claims to include
            
        Returns:
            str: JWT access token
            
        Example:
            >>> token = auth_service.create_access_token("user123")
        """
        try:
            return create_access_token(user_id, additional_claims)
        except Exception as e:
            logger.error(f"Token creation error: {str(e)}")
            raise
    
    async def verify_token(self, token: str) -> UserInDB:
        """
        Verify a JWT token and return the associated user.
        
        Args:
            token: JWT access token to verify
            
        Returns:
            UserInDB: User associated with the token
            
        Raises:
            TokenExpiredError: If token has expired
            InvalidTokenError: If token is invalid
            
        Example:
            >>> user = await auth_service.verify_token(token)
        """
        try:
            # Verify and decode token
            payload = verify_token(token)
            
            # Extract user_id
            user_id = payload.get("user_id")
            if not user_id:
                raise InvalidTokenError("Token missing user_id")
            
            # Get user from database
            user = await self.user_repo.get_user_by_id(user_id)
            if not user:
                logger.warning(f"Token verification failed: User not found: {user_id}")
                raise InvalidTokenError("User not found")
            
            return user
            
        except ExpiredSignatureError:
            logger.warning("Token verification failed: Token expired")
            raise TokenExpiredError("Token has expired")
        
        except InvalidTokenError as e:
            logger.warning(f"Token verification failed: {str(e)}")
            raise InvalidTokenError(str(e))
        
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            raise InvalidTokenError(f"Token verification failed: {str(e)}")
    
    async def get_current_user(self, token: str) -> UserInDB:
        """
        Get the current authenticated user from token.
        
        Alias for verify_token() for better semantic clarity.
        
        Args:
            token: JWT access token
            
        Returns:
            UserInDB: Current authenticated user
            
        Raises:
            TokenExpiredError: If token has expired
            InvalidTokenError: If token is invalid
        """
        return await self.verify_token(token)
    
    async def change_password(
        self,
        user_id: str,
        current_password: str,
        new_password: str
    ) -> bool:
        """
        Change a user's password.
        
        Args:
            user_id: User's unique identifier
            current_password: Current password for verification
            new_password: New password to set
            
        Returns:
            bool: True if password changed successfully
            
        Raises:
            InvalidCredentialsError: If current password is incorrect
            ValueError: If user not found
            
        Example:
            >>> success = await auth_service.change_password(
            ...     user_id="123",
            ...     current_password="OldPass123",
            ...     new_password="NewPass456"
            ... )
        """
        try:
            # Get user
            user = await self.user_repo.get_user_by_id(user_id)
            if not user:
                raise ValueError("User not found")
            
            # Verify current password
            if not verify_password(current_password, user.password_hash):
                logger.warning(f"Password change failed: Invalid current password for user: {user_id}")
                raise InvalidCredentialsError("Current password is incorrect")
            
            # Hash new password
            new_password_hash = hash_password(new_password)
            
            # Update password
            success = await self.user_repo.update_password(user_id, new_password_hash)
            
            if success:
                logger.info(f"✅ Password changed successfully for user: {user_id}")
            
            return success
            
        except InvalidCredentialsError:
            raise
        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            raise


# Global authentication service instance
auth_service = AuthService()
