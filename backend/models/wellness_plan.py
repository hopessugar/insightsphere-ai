"""
Wellness Plan data models with Pydantic validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class WellnessPlanCreate(BaseModel):
    """Model for creating a wellness plan"""
    activities: List[str] = Field(..., description="List of wellness activities")
    goals: List[str] = Field(default_factory=list, description="Wellness goals")
    notes: Optional[str] = Field(None, description="Additional notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "activities": ["Morning meditation", "Evening walk", "Journaling"],
                "goals": ["Reduce stress", "Improve sleep"],
                "notes": "Focus on consistency"
            }
        }


class WellnessPlanInDB(BaseModel):
    """Model for wellness plan stored in database"""
    id: str = Field(alias="_id")
    user_id: str
    activities: List[str]
    goals: List[str]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class WellnessPlanResponse(BaseModel):
    """Model for wellness plan API response"""
    _id: str
    activities: List[str]
    goals: List[str]
    notes: Optional[str]
    created_at: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "activities": ["Morning meditation", "Evening walk"],
                "goals": ["Reduce stress"],
                "notes": "Focus on consistency",
                "created_at": "2024-01-01T00:00:00Z"
            }
        }
