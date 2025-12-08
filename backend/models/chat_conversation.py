"""
Chat Conversation data models with Pydantic validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class Message(BaseModel):
    """Model for a single chat message"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "I'm feeling anxious today",
                "timestamp": "2024-01-01T00:00:00Z"
            }
        }


class ChatConversationCreate(BaseModel):
    """Model for creating a chat conversation"""
    title: Optional[str] = Field(None, description="Conversation title")
    conversation_type: str = Field(default="therapy", description="Type: therapy or shadow_work")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Anxiety Discussion",
                "conversation_type": "therapy"
            }
        }


class MessageCreate(BaseModel):
    """Model for adding a message to conversation"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatConversationInDB(BaseModel):
    """Model for chat conversation stored in database"""
    id: str = Field(alias="_id")
    user_id: str
    title: Optional[str]
    conversation_type: str
    messages: List[Message]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat() + 'Z'}


class ChatConversationResponse(BaseModel):
    """Model for chat conversation API response"""
    _id: str
    title: Optional[str]
    conversation_type: str
    messages: List[dict]
    created_at: str
    updated_at: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "title": "Anxiety Discussion",
                "conversation_type": "therapy",
                "messages": [
                    {"role": "user", "content": "I'm feeling anxious", "timestamp": "2024-01-01T00:00:00Z"}
                ],
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }
