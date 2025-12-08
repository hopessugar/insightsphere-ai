"""
Mood Log data models with Pydantic validation.
"""
from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime
from bson import ObjectId


class Activities(BaseModel):
    """Model for daily activities"""
    exercise: bool = False
    social: bool = False
    meditation: bool = False


class MoodLogCreate(BaseModel):
    """Model for creating a mood log"""
    date: str = Field(..., description="Date of the mood log (YYYY-MM-DD)")
    mood: int = Field(..., ge=0, le=10, description="Mood score 0-10")
    energy: int = Field(..., ge=0, le=10, description="Energy level 0-10")
    anxiety: int = Field(..., ge=0, le=10, description="Anxiety level 0-10")
    sleep: int = Field(..., ge=0, le=10, description="Sleep quality 0-10")
    activities: Activities = Field(..., description="Daily activities")
    notes: Optional[str] = Field(default="", description="Optional notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "date": "2024-01-01",
                "mood": 7,
                "energy": 6,
                "anxiety": 3,
                "sleep": 8,
                "activities": {
                    "exercise": True,
                    "social": False,
                    "meditation": True
                },
                "notes": "Had a great day!"
            }
        }


class MoodLogInDB(BaseModel):
    """Model for mood log stored in database"""
    id: str = Field(alias="_id")
    user_id: str
    date: str
    mood: int
    energy: int
    anxiety: int
    sleep: int
    activities: Dict[str, bool]
    notes: str
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class MoodLogResponse(BaseModel):
    """Model for mood log API response"""
    _id: str
    date: str
    mood: int
    energy: int
    anxiety: int
    sleep: int
    activities: Dict[str, bool]
    notes: str
    created_at: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "date": "2024-01-01",
                "mood": 7,
                "energy": 6,
                "anxiety": 3,
                "sleep": 8,
                "activities": {
                    "exercise": True,
                    "social": False,
                    "meditation": True
                },
                "notes": "Had a great day!",
                "created_at": "2024-01-01T00:00:00Z"
            }
        }
