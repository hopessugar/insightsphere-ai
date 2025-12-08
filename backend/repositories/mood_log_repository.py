"""
Mood Log Repository

Handles database operations for mood logs.
"""
import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from database.connection import db_manager
from models.mood_log import MoodLogCreate, MoodLogInDB

logger = logging.getLogger(__name__)


class MoodLogRepository:
    """Repository for mood log database operations"""
    
    def __init__(self):
        """Initialize mood log repository"""
        self.collection_name = "mood_logs"
    
    @property
    def collection(self):
        """Get mood logs collection"""
        return db_manager.db[self.collection_name]
    
    async def create_mood_log(
        self,
        user_id: str,
        mood_data: MoodLogCreate
    ) -> MoodLogInDB:
        """
        Create a new mood log for a user.
        
        Args:
            user_id: User's unique identifier
            mood_data: Mood log data
            
        Returns:
            MoodLogInDB: Created mood log
        """
        try:
            mood_dict = mood_data.model_dump()
            mood_dict["user_id"] = user_id
            mood_dict["created_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(mood_dict)
            mood_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"✅ Mood log created for user: {user_id}")
            
            return MoodLogInDB(
                _id=str(result.inserted_id),
                user_id=user_id,
                **mood_data.model_dump(),
                created_at=mood_dict["created_at"]
            )
            
        except Exception as e:
            logger.error(f"Error creating mood log: {str(e)}")
            raise
    
    async def get_user_mood_logs(
        self,
        user_id: str,
        limit: int = 50,
        skip: int = 0
    ) -> List[MoodLogInDB]:
        """
        Get mood logs for a specific user.
        
        Args:
            user_id: User's unique identifier
            limit: Maximum number of logs to return
            skip: Number of logs to skip
            
        Returns:
            List[MoodLogInDB]: List of mood logs
        """
        try:
            cursor = self.collection.find(
                {"user_id": user_id}
            ).sort("created_at", -1).skip(skip).limit(limit)
            
            mood_logs = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                mood_logs.append(MoodLogInDB(**doc))
            
            logger.info(f"Retrieved {len(mood_logs)} mood logs for user: {user_id}")
            return mood_logs
            
        except Exception as e:
            logger.error(f"Error retrieving mood logs: {str(e)}")
            raise
    
    async def get_mood_log_by_id(
        self,
        log_id: str,
        user_id: str
    ) -> Optional[MoodLogInDB]:
        """
        Get a specific mood log by ID (with user ownership check).
        
        Args:
            log_id: Mood log ID
            user_id: User's unique identifier
            
        Returns:
            Optional[MoodLogInDB]: Mood log if found and owned by user
        """
        try:
            if not ObjectId.is_valid(log_id):
                return None
            
            doc = await self.collection.find_one({
                "_id": ObjectId(log_id),
                "user_id": user_id
            })
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return MoodLogInDB(**doc)
            
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving mood log: {str(e)}")
            raise
    
    async def delete_mood_log(
        self,
        log_id: str,
        user_id: str
    ) -> bool:
        """
        Delete a mood log (with user ownership check).
        
        Args:
            log_id: Mood log ID
            user_id: User's unique identifier
            
        Returns:
            bool: True if deleted, False otherwise
        """
        try:
            if not ObjectId.is_valid(log_id):
                return False
            
            result = await self.collection.delete_one({
                "_id": ObjectId(log_id),
                "user_id": user_id
            })
            
            if result.deleted_count > 0:
                logger.info(f"✅ Mood log deleted: {log_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting mood log: {str(e)}")
            raise
    
    async def get_mood_log_count(self, user_id: str) -> int:
        """
        Get total count of mood logs for a user.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            int: Total count of mood logs
        """
        try:
            count = await self.collection.count_documents({"user_id": user_id})
            return count
        except Exception as e:
            logger.error(f"Error counting mood logs: {str(e)}")
            raise


# Global mood log repository instance
mood_log_repository = MoodLogRepository()
