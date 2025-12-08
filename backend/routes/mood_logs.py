"""
Mood Log API Routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging

from models.mood_log import MoodLogCreate, MoodLogResponse
from repositories.mood_log_repository import mood_log_repository
from core.dependencies import get_current_user_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/mood-logs", tags=["Mood Logs"])


@router.post(
    "",
    response_model=MoodLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new mood log"
)
async def create_mood_log(
    mood_data: MoodLogCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new mood log for the authenticated user."""
    try:
        mood_log = await mood_log_repository.create_mood_log(user_id, mood_data)
        
        return MoodLogResponse(
            _id=mood_log.id,
            date=mood_log.date,
            mood=mood_log.mood,
            energy=mood_log.energy,
            anxiety=mood_log.anxiety,
            sleep=mood_log.sleep,
            activities=mood_log.activities,
            notes=mood_log.notes,
            created_at=mood_log.created_at.isoformat() + 'Z'
        )
    except Exception as e:
        logger.error(f"Error creating mood log: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mood log"
        )


@router.get(
    "",
    summary="Get user's mood logs"
)
async def get_mood_logs(
    limit: int = 100,
    skip: int = 0,
    user_id: str = Depends(get_current_user_id)
):
    """Get mood logs for the authenticated user."""
    try:
        mood_logs = await mood_log_repository.get_user_mood_logs(user_id, limit, skip)
        
        return {
            "mood_logs": [
                {
                    "_id": log.id,
                    "date": log.date,
                    "mood": log.mood,
                    "energy": log.energy,
                    "anxiety": log.anxiety,
                    "sleep": log.sleep,
                    "activities": log.activities,
                    "notes": log.notes,
                    "created_at": log.created_at.isoformat() + 'Z'
                }
                for log in mood_logs
            ]
        }
    except Exception as e:
        logger.error(f"Error retrieving mood logs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mood logs"
        )


@router.delete(
    "/{log_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a mood log"
)
async def delete_mood_log(
    log_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a mood log (only if owned by the authenticated user)."""
    try:
        deleted = await mood_log_repository.delete_mood_log(log_id, user_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mood log not found or not owned by user"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mood log: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mood log"
        )
