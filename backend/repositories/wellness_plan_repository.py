"""
Wellness Plan Repository
"""
import logging
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from database.connection import db_manager
from models.wellness_plan import WellnessPlanCreate, WellnessPlanInDB

logger = logging.getLogger(__name__)


class WellnessPlanRepository:
    """Repository for wellness plan database operations"""
    
    def __init__(self):
        self.collection_name = "wellness_plans"
    
    @property
    def collection(self):
        return db_manager.db[self.collection_name]
    
    async def create_wellness_plan(
        self,
        user_id: str,
        plan_data: WellnessPlanCreate
    ) -> WellnessPlanInDB:
        """Create a new wellness plan for a user."""
        try:
            plan_dict = plan_data.model_dump()
            plan_dict["user_id"] = user_id
            plan_dict["created_at"] = datetime.utcnow()
            
            result = await self.collection.insert_one(plan_dict)
            
            logger.info(f"✅ Wellness plan created for user: {user_id}")
            
            return WellnessPlanInDB(
                _id=str(result.inserted_id),
                user_id=user_id,
                **plan_data.model_dump(),
                created_at=plan_dict["created_at"]
            )
        except Exception as e:
            logger.error(f"Error creating wellness plan: {str(e)}")
            raise
    
    async def get_user_wellness_plans(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[WellnessPlanInDB]:
        """Get wellness plans for a user."""
        try:
            cursor = self.collection.find(
                {"user_id": user_id}
            ).sort("created_at", -1).limit(limit)
            
            plans = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                plans.append(WellnessPlanInDB(**doc))
            
            return plans
        except Exception as e:
            logger.error(f"Error retrieving wellness plans: {str(e)}")
            raise
    
    async def get_latest_wellness_plan(
        self,
        user_id: str
    ) -> Optional[WellnessPlanInDB]:
        """Get the most recent wellness plan for a user."""
        try:
            doc = await self.collection.find_one(
                {"user_id": user_id},
                sort=[("created_at", -1)]
            )
            
            if doc:
                doc["_id"] = str(doc["_id"])
                return WellnessPlanInDB(**doc)
            
            return None
        except Exception as e:
            logger.error(f"Error retrieving latest wellness plan: {str(e)}")
            raise


# Global wellness plan repository instance
wellness_plan_repository = WellnessPlanRepository()
