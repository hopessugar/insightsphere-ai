"""
Chat Conversation Repository
"""
import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from database.connection import db_manager
from models.chat_conversation import (
    ChatConversationCreate,
    ChatConversationInDB,
    MessageCreate,
    Message
)

logger = logging.getLogger(__name__)


class ChatRepository:
    """Repository for chat conversation database operations"""
    
    def __init__(self):
        self.collection_name = "chat_conversations"
    
    @property
    def collection(self):
        return db_manager.get_collection(self.collection_name)
    
    async def create_conversation(
        self,
        user_id: str,
        conversation_data: ChatConversationCreate
    ) -> ChatConversationInDB:
        """Create a new chat conversation."""
        try:
            conv_dict = conversation_data.model_dump()
            conv_dict["user_id"] = user_id
            conv_dict["messages"] = []
            conv_dict["created_at"] = datetime.utcnow()
            conv_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(conv_dict)
            
            logger.info(f"✅ Chat conversation created for user: {user_id}")
            
            return ChatConversationInDB(
                _id=str(result.inserted_id),
                user_id=user_id,
                title=conversation_data.title,
                conversation_type=conversation_data.conversation_type,
                messages=[],
                created_at=conv_dict["created_at"],
                updated_at=conv_dict["updated_at"]
            )
        except Exception as e:
            logger.error(f"Error creating conversation: {str(e)}")
            raise
    
    async def add_message(
        self,
        conversation_id: str,
        user_id: str,
        message_data: MessageCreate
    ) -> bool:
        """Add a message to a conversation."""
        try:
            if not ObjectId.is_valid(conversation_id):
                return False
            
            message = Message(
                role=message_data.role,
                content=message_data.content,
                timestamp=datetime.utcnow()
            )
            
            result = await self.collection.update_one(
                {"_id": ObjectId(conversation_id), "user_id": user_id},
                {
                    "$push": {"messages": message.model_dump()},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count > 0:
                logger.info(f"✅ Message added to conversation: {conversation_id}")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Error adding message: {str(e)}")
            raise
    
    async def get_user_conversations(
        self,
        user_id: str,
        conversation_type: Optional[str] = None,
        limit: int = 50
    ) -> List[ChatConversationInDB]:
        """Get conversations for a user."""
        try:
            query = {"user_id": user_id}
            if conversation_type:
                query["conversation_type"] = conversation_type
            
            cursor = self.collection.find(query).sort("updated_at", -1).limit(limit)
            
            conversations = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                conversations.append(ChatConversationInDB(**doc))
            
            return conversations
        except Exception as e:
            logger.error(f"Error retrieving conversations: {str(e)}")
            raise
    
    async def get_conversation_by_id(
        self,
        conversation_id: str,
        user_id: str
    ) -> Optional[ChatConversationInDB]:
        """Get a specific conversation by ID."""
        try:
            if not ObjectId.is_valid(conversation_id):
                return None
            
            doc = await self.collection.find_one({
                "_id": ObjectId(conversation_id),
                "user_id": user_id
            })
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return ChatConversationInDB(**doc)
            
            return None
        except Exception as e:
            logger.error(f"Error retrieving conversation: {str(e)}")
            raise
    
    async def delete_conversation(
        self,
        conversation_id: str,
        user_id: str
    ) -> bool:
        """Delete a conversation."""
        try:
            if not ObjectId.is_valid(conversation_id):
                return False
            
            result = await self.collection.delete_one({
                "_id": ObjectId(conversation_id),
                "user_id": user_id
            })
            
            if result.deleted_count > 0:
                logger.info(f"✅ Conversation deleted: {conversation_id}")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Error deleting conversation: {str(e)}")
            raise


# Global chat repository instance
chat_repository = ChatRepository()
