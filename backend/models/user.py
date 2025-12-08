"""
User data models with Pydantic validation.

Defines the User model and related schemas for user management.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v, info):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserPreferences(BaseModel):
    """User preferences and settings"""
    theme: str = "light"
    notifications: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "theme": "light",
                "notifications": True
            }
        }


class UserProfile(BaseModel):
    """User profile information"""
    avatar_url: Optional[str] = None
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    
    class Config:
        json_schema_extra = {
            "example": {
                "avatar_url": "https://example.com/avatar.jpg",
                "preferences": {
                    "theme": "dark",
                    "notifications": True
                }
            }
        }


class UserBase(BaseModel):
    """Base user model with common fields"""
    email: EmailStr = Field(..., description="User's email address")
    name: str = Field(..., min_length=1, max_length=100, description="User's full name")
    
    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        """Validate that name is not empty or whitespace"""
        if not v or not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe"
            }
        }


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(..., min_length=8, description="User's password (min 8 characters)")
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "SecurePassword123"
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    profile: Optional[UserProfile] = None
    
    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate that name is not empty or whitespace if provided"""
        if v is not None and (not v or not v.strip()):
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip() if v else None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jane@example.com"
            }
        }


class UserInDB(UserBase):
    """User model as stored in database"""
    id: str = Field(alias="_id", description="User's unique identifier")
    password_hash: str = Field(..., description="Hashed password")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    profile: UserProfile = Field(default_factory=UserProfile)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "email": "user@example.com",
                "name": "John Doe",
                "password_hash": "$2b$12$...",
                "created_at": "2024-01-01T00:00:00Z",
                "last_login": "2024-01-02T00:00:00Z",
                "profile": {
                    "avatar_url": None,
                    "preferences": {
                        "theme": "light",
                        "notifications": True
                    }
                }
            }
        }


class UserResponse(UserBase):
    """User model for API responses (without sensitive data)"""
    id: str = Field(alias="_id", description="User's unique identifier")
    created_at: datetime
    last_login: Optional[datetime] = None
    profile: UserProfile = Field(default_factory=UserProfile)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2024-01-01T00:00:00Z",
                "last_login": "2024-01-02T00:00:00Z",
                "profile": {
                    "avatar_url": None,
                    "preferences": {
                        "theme": "light",
                        "notifications": True
                    }
                }
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePassword123"
            }
        }


class PasswordChange(BaseModel):
    """Schema for changing password"""
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @field_validator('new_password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "current_password": "OldPassword123",
                "new_password": "NewSecurePassword456"
            }
        }
