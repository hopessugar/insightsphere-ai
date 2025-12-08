"""
User Repository for database operations.

Handles all CRUD operations for users in MongoDB.
"""
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from models.user import UserCreate, UserInDB, UserUpdate, UserProfile
from database import db_manager

logger = logging.getLogger(__name__)


class UserRepository:
    """
    Repository for user database operations.
    
    Provides CRUD operations and email uniqueness validation.
    """
    
    def __init__(self):
        """Initialize user repository"""
        self.collection_name = "users"
    
    def _get_collection(self):
        """Get users collection"""
        return db_manager.get_collection(self.collection_name)
    
    async def create_user(self, user_data: UserCreate, password_hash: str) -> UserInDB:
        """
        Create a new user in the database.
        
        Args:
            user_data: User creation data
            password_hash: Hashed password
            
        Returns:
            UserInDB: Created user with database ID
            
        Raises:
            DuplicateKeyError: If email already exists
            ValueError: If user data is invalid
        """
        try:
            collection = self._get_collection()
            
            # Prepare user document
            user_doc = {
                "email": user_data.email.lower(),  # Store email in lowercase
                "name": user_data.name,
                "password_hash": password_hash,
                "created_at": datetime.utcnow(),
                "last_login": None,
                "profile": {
                    "avatar_url": None,
                    "preferences": {
                        "theme": "light",
                        "notifications": True
                    }
                }
            }
            
            # Insert user
            result = await collection.insert_one(user_doc)
            
            # Retrieve created user
            created_user = await collection.find_one({"_id": result.inserted_id})
            
            if not created_user:
                raise ValueError("Failed to retrieve created user")
            
            # Convert to UserInDB model
            created_user["_id"] = str(created_user["_id"])
            user_in_db = UserInDB(**created_user)
            
            logger.info(f"✅ User created successfully: {user_data.email}")
            return user_in_db
            
        except DuplicateKeyError:
            logger.warning(f"❌ Duplicate email attempted: {user_data.email}")
            raise DuplicateKeyError(
                f"User with email {user_data.email} already exists"
            )
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """
        Find user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            UserInDB if found, None otherwise
        """
        try:
            collection = self._get_collection()
            
            # Search with case-insensitive email
            user_doc = await collection.find_one({"email": email.lower()})
            
            if not user_doc:
                return None
            
            # Convert ObjectId to string
            user_doc["_id"] = str(user_doc["_id"])
            
            return UserInDB(**user_doc)
            
        except Exception as e:
            logger.error(f"Error finding user by email: {str(e)}")
            raise
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """
        Find user by ID.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            UserInDB if found, None otherwise
        """
        try:
            collection = self._get_collection()
            
            # Validate ObjectId
            if not ObjectId.is_valid(user_id):
                return None
            
            user_doc = await collection.find_one({"_id": ObjectId(user_id)})
            
            if not user_doc:
                return None
            
            # Convert ObjectId to string
            user_doc["_id"] = str(user_doc["_id"])
            
            return UserInDB(**user_doc)
            
        except Exception as e:
            logger.error(f"Error finding user by ID: {str(e)}")
            raise
    
    async def update_user(
        self, 
        user_id: str, 
        updates: UserUpdate
    ) -> Optional[UserInDB]:
        """
        Update user information.
        
        Args:
            user_id: User's unique identifier
            updates: Fields to update
            
        Returns:
            Updated UserInDB if successful, None if user not found
            
        Raises:
            DuplicateKeyError: If new email already exists
        """
        try:
            collection = self._get_collection()
            
            # Validate ObjectId
            if not ObjectId.is_valid(user_id):
                return None
            
            # Build update document
            update_doc = {}
            if updates.name is not None:
                update_doc["name"] = updates.name
            if updates.email is not None:
                update_doc["email"] = updates.email.lower()
            if updates.profile is not None:
                update_doc["profile"] = updates.profile.model_dump()
            
            if not update_doc:
                # No updates provided, return current user
                return await self.get_user_by_id(user_id)
            
            # Update user
            result = await collection.find_one_and_update(
                {"_id": ObjectId(user_id)},
                {"$set": update_doc},
                return_document=True  # Return updated document
            )
            
            if not result:
                return None
            
            # Convert ObjectId to string
            result["_id"] = str(result["_id"])
            
            logger.info(f"✅ User updated successfully: {user_id}")
            return UserInDB(**result)
            
        except DuplicateKeyError:
            logger.warning(f"❌ Duplicate email in update: {updates.email}")
            raise DuplicateKeyError(
                f"User with email {updates.email} already exists"
            )
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            raise
    
    async def update_last_login(self, user_id: str) -> bool:
        """
        Update user's last login timestamp.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if successful, False otherwise
        """
        try:
            collection = self._get_collection()
            
            # Validate ObjectId
            if not ObjectId.is_valid(user_id):
                return False
            
            result = await collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error updating last login: {str(e)}")
            return False
    
    async def update_password(self, user_id: str, new_password_hash: str) -> bool:
        """
        Update user's password hash.
        
        Args:
            user_id: User's unique identifier
            new_password_hash: New hashed password
            
        Returns:
            True if successful, False otherwise
        """
        try:
            collection = self._get_collection()
            
            # Validate ObjectId
            if not ObjectId.is_valid(user_id):
                return False
            
            result = await collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"password_hash": new_password_hash}}
            )
            
            logger.info(f"✅ Password updated for user: {user_id}")
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error updating password: {str(e)}")
            return False
    
    async def delete_user(self, user_id: str) -> bool:
        """
        Delete user from database.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if successful, False otherwise
        """
        try:
            collection = self._get_collection()
            
            # Validate ObjectId
            if not ObjectId.is_valid(user_id):
                return False
            
            result = await collection.delete_one({"_id": ObjectId(user_id)})
            
            if result.deleted_count > 0:
                logger.info(f"✅ User deleted: {user_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            return False
    
    async def email_exists(self, email: str) -> bool:
        """
        Check if email already exists in database.
        
        Args:
            email: Email address to check
            
        Returns:
            True if email exists, False otherwise
        """
        try:
            collection = self._get_collection()
            
            count = await collection.count_documents({"email": email.lower()})
            return count > 0
            
        except Exception as e:
            logger.error(f"Error checking email existence: {str(e)}")
            return False


# Global user repository instance
user_repository = UserRepository()
