"""
Chat History API Routes
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
import logging

from models.chat_conversation import (
    ChatConversationCreate,
    ChatConversationResponse,
    MessageCreate
)
from repositories.chat_repository import chat_repository
from core.dependencies import get_current_user_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat History"])


@router.post(
    "/conversations",
    response_model=ChatConversationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new chat conversation"
)
async def create_conversation(
    conversation_data: ChatConversationCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new chat conversation for the authenticated user."""
    try:
        conversation = await chat_repository.create_conversation(user_id, conversation_data)
        
        return ChatConversationResponse(
            _id=conversation.id,
            title=conversation.title,
            conversation_type=conversation.conversation_type,
            messages=[],
            created_at=conversation.created_at.isoformat() + 'Z',
            updated_at=conversation.updated_at.isoformat() + 'Z'
        )
    except Exception as e:
        logger.error(f"Error creating conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create conversation"
        )


@router.get(
    "/conversations",
    response_model=List[ChatConversationResponse],
    summary="Get user's chat conversations"
)
async def get_conversations(
    conversation_type: Optional[str] = Query(None, description="Filter by type: therapy or shadow_work"),
    limit: int = Query(50, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """Get chat conversations for the authenticated user."""
    try:
        conversations = await chat_repository.get_user_conversations(
            user_id, conversation_type, limit
        )
        
        return [
            ChatConversationResponse(
                _id=conv.id,
                title=conv.title,
                conversation_type=conv.conversation_type,
                messages=[msg.model_dump() for msg in conv.messages],
                created_at=conv.created_at.isoformat() + 'Z',
                updated_at=conv.updated_at.isoformat() + 'Z'
            )
            for conv in conversations
        ]
    except Exception as e:
        logger.error(f"Error retrieving conversations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversations"
        )


@router.get(
    "/conversations/{conversation_id}",
    response_model=ChatConversationResponse,
    summary="Get a specific conversation"
)
async def get_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get a specific conversation by ID."""
    try:
        conversation = await chat_repository.get_conversation_by_id(conversation_id, user_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        return ChatConversationResponse(
            _id=conversation.id,
            title=conversation.title,
            conversation_type=conversation.conversation_type,
            messages=[msg.model_dump() for msg in conversation.messages],
            created_at=conversation.created_at.isoformat() + 'Z',
            updated_at=conversation.updated_at.isoformat() + 'Z'
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation"
        )


@router.post(
    "/messages",
    status_code=status.HTTP_201_CREATED,
    summary="Add a message to a conversation"
)
async def add_message(
    conversation_id: str = Query(..., description="Conversation ID"),
    message_data: MessageCreate = ...,
    user_id: str = Depends(get_current_user_id)
):
    """Add a message to an existing conversation."""
    try:
        success = await chat_repository.add_message(conversation_id, user_id, message_data)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or not owned by user"
            )
        
        return {"message": "Message added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add message"
        )


@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a conversation"
)
async def delete_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a conversation."""
    try:
        deleted = await chat_repository.delete_conversation(conversation_id, user_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or not owned by user"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete conversation"
        )
