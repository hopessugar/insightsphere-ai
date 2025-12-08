"""
Wellness Plan API Routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging

from models.wellness_plan import WellnessPlanCreate, WellnessPlanResponse
from repositories.wellness_plan_repository import wellness_plan_repository
from core.dependencies import get_current_user_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/wellness-plans", tags=["Wellness Plans"])


@router.post(
    "",
    response_model=WellnessPlanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new wellness plan"
)
async def create_wellness_plan(
    plan_data: WellnessPlanCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new wellness plan for the authenticated user."""
    try:
        plan = await wellness_plan_repository.create_wellness_plan(user_id, plan_data)
        
        return WellnessPlanResponse(
            _id=plan.id,
            activities=plan.activities,
            goals=plan.goals,
            notes=plan.notes,
            created_at=plan.created_at.isoformat() + 'Z'
        )
    except Exception as e:
        logger.error(f"Error creating wellness plan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create wellness plan"
        )


@router.get(
    "",
    response_model=List[WellnessPlanResponse],
    summary="Get user's wellness plans"
)
async def get_wellness_plans(
    limit: int = 10,
    user_id: str = Depends(get_current_user_id)
):
    """Get wellness plans for the authenticated user."""
    try:
        plans = await wellness_plan_repository.get_user_wellness_plans(user_id, limit)
        
        return [
            WellnessPlanResponse(
                _id=plan.id,
                activities=plan.activities,
                goals=plan.goals,
                notes=plan.notes,
                created_at=plan.created_at.isoformat() + 'Z'
            )
            for plan in plans
        ]
    except Exception as e:
        logger.error(f"Error retrieving wellness plans: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve wellness plans"
        )


@router.get(
    "/latest",
    response_model=WellnessPlanResponse,
    summary="Get latest wellness plan"
)
async def get_latest_wellness_plan(
    user_id: str = Depends(get_current_user_id)
):
    """Get the most recent wellness plan for the authenticated user."""
    try:
        plan = await wellness_plan_repository.get_latest_wellness_plan(user_id)
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No wellness plans found"
            )
        
        return WellnessPlanResponse(
            _id=plan.id,
            activities=plan.activities,
            goals=plan.goals,
            notes=plan.notes,
            created_at=plan.created_at.isoformat() + 'Z'
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving latest wellness plan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve wellness plan"
        )
