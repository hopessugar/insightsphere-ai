"""
Pydantic schemas for InsightSphere AI API.

These models define the structure and validation rules for API requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class AnalysisRequest(BaseModel):
    """
    Request model for text analysis.
    
    Attributes:
        text: User input text to analyze (20-5000 characters)
        user_id: Optional user identifier for future extensions
    """
    text: str = Field(
        ...,
        min_length=20,
        max_length=5000,
        description="Text to analyze for emotional content and patterns",
        examples=["I've been feeling anxious about my exams and my future. I try to stay positive, but sometimes it feels overwhelming."]
    )
    user_id: Optional[str] = Field(
        None,
        description="Optional user identifier for session tracking"
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "text": "I've been feeling really happy lately. Things are going well at work and I'm excited about the future.",
                    "user_id": None
                }
            ]
        }
    }


class AnalysisResponse(BaseModel):
    """
    Response model for text analysis results.
    
    Attributes:
        emotions: Dictionary of emotion scores (0.0-1.0) for joy, sadness, anxiety, anger, calm
        primary_emotion: The emotion with the highest score
        stress_score: Overall stress level (0-100)
        cognitive_distortions: List of detected unhelpful thinking patterns
        summary: Human-readable 1-2 sentence summary of the analysis
        suggestions: List of coping tips and journaling prompts (4-6 items)
        timestamp: ISO 8601 formatted timestamp of analysis
    """
    emotions: Dict[str, float] = Field(
        ...,
        description="Emotion scores between 0.0 and 1.0",
        examples=[{"joy": 0.7, "sadness": 0.1, "anxiety": 0.2, "anger": 0.0, "calm": 0.3}]
    )
    primary_emotion: str = Field(
        ...,
        description="The dominant emotion detected",
        examples=["joy"]
    )
    stress_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Stress level from 0 (no stress) to 100 (extreme stress)",
        examples=[35.5]
    )
    cognitive_distortions: List[str] = Field(
        ...,
        description="List of detected cognitive distortion patterns",
        examples=[["overgeneralization", "catastrophizing"]]
    )
    summary: str = Field(
        ...,
        description="Human-readable summary of the emotional analysis",
        examples=["You're expressing feelings of joy with low stress. It's wonderful to see positive emotions coming through."]
    )
    suggestions: List[str] = Field(
        ...,
        min_length=4,
        max_length=6,
        description="Personalized coping tips and journaling prompts",
        examples=[[
            "Take a moment to savor this positive feeling and notice what brought it about.",
            "Share your joy with someone you care about - positive emotions grow when shared.",
            "What specific moments today brought you happiness?",
            "Who or what are you most grateful for right now?"
        ]]
    )
    timestamp: str = Field(
        ...,
        description="ISO 8601 formatted timestamp",
        examples=["2024-01-15T10:30:00Z"]
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "emotions": {
                        "joy": 0.7,
                        "sadness": 0.1,
                        "anxiety": 0.2,
                        "anger": 0.0,
                        "calm": 0.3
                    },
                    "primary_emotion": "joy",
                    "stress_score": 25.5,
                    "cognitive_distortions": [],
                    "summary": "You're expressing feelings of joy with low stress. It's wonderful to see positive emotions coming through.",
                    "suggestions": [
                        "Take a moment to savor this positive feeling and notice what brought it about.",
                        "Share your joy with someone you care about - positive emotions grow when shared.",
                        "What specific moments today brought you happiness?",
                        "Who or what are you most grateful for right now?"
                    ],
                    "timestamp": "2024-01-15T10:30:00Z"
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    """
    Error response model.
    
    Attributes:
        detail: Error message
        error_type: Type of error (validation_error, processing_error, server_error)
    """
    detail: str = Field(
        ...,
        description="Detailed error message",
        examples=["Text must be at least 20 characters"]
    )
    error_type: str = Field(
        ...,
        description="Category of error",
        examples=["validation_error"]
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Text must be at least 20 characters",
                    "error_type": "validation_error"
                }
            ]
        }
    }


class ChatRequest(BaseModel):
    """
    Request model for AI therapist chat.
    
    Attributes:
        message: User's message to the therapist
        conversation_history: Previous messages in the conversation
        emotional_context: Optional emotional analysis data for context
    """
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's message to the AI therapist",
        examples=["I've been feeling really anxious about my job interview tomorrow. I keep thinking I'm going to mess it up."]
    )
    conversation_history: Optional[List[Dict[str, str]]] = Field(
        None,
        description="Previous conversation messages [{'role': 'user/assistant', 'content': '...'}]",
        examples=[[
            {"role": "user", "content": "I'm feeling stressed"},
            {"role": "assistant", "content": "I hear that you're feeling stressed..."}
        ]]
    )
    emotional_context: Optional[Dict] = Field(
        None,
        description="Optional emotional analysis data (emotions, stress_score, etc.)",
        examples=[{
            "primary_emotion": "anxiety",
            "stress_score": 75.0,
            "cognitive_distortions": ["catastrophizing"]
        }]
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "message": "I've been feeling really anxious about my job interview tomorrow.",
                    "conversation_history": [],
                    "emotional_context": {
                        "primary_emotion": "anxiety",
                        "stress_score": 68.0
                    }
                }
            ]
        }
    }


class ChatResponse(BaseModel):
    """
    Response model for AI therapist chat.
    
    Attributes:
        response: AI therapist's response
        crisis_detected: Whether crisis indicators were detected
        crisis_severity: Severity level (none, low, medium, high)
        crisis_resources: Crisis support resources if applicable
        timestamp: ISO 8601 formatted timestamp
    """
    response: str = Field(
        ...,
        description="AI therapist's response to the user",
        examples=["I hear that you're feeling anxious about your interview, and that's completely understandable..."]
    )
    crisis_detected: bool = Field(
        ...,
        description="Whether crisis indicators were detected in the message",
        examples=[False]
    )
    crisis_severity: str = Field(
        ...,
        description="Crisis severity level: none, low, medium, or high",
        examples=["none"]
    )
    crisis_resources: Optional[Dict] = Field(
        None,
        description="Crisis support resources if crisis detected",
        examples=[None]
    )
    timestamp: str = Field(
        ...,
        description="ISO 8601 formatted timestamp",
        examples=["2024-01-15T10:30:00Z"]
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "response": "I hear that you're feeling anxious about your interview tomorrow, and that's completely understandable. Job interviews can feel really high-stakes. Let's work through this together...",
                    "crisis_detected": False,
                    "crisis_severity": "none",
                    "crisis_resources": None,
                    "timestamp": "2024-01-15T10:30:00Z"
                }
            ]
        }
    }
