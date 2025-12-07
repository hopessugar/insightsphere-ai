"""
InsightSphere AI - FastAPI Backend Application

This is the main application file that sets up the FastAPI server,
configures CORS, and defines API endpoints for text analysis.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import logging

from schemas.analysis import AnalysisRequest, AnalysisResponse, ErrorResponse, ChatRequest, ChatResponse
from core.models_nlp import TextAnalyzer
from core.suggestions import SuggestionGenerator
from core.ai_therapist import AITherapist

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="InsightSphere AI API",
    description="AI-powered mental wellness and cognitive insight system. Analyzes text for emotions, stress levels, and cognitive patterns.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
origins_str = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000')
origins = [origin.strip() for origin in origins_str.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize analyzers
text_analyzer = TextAnalyzer()
suggestion_generator = SuggestionGenerator()
ai_therapist = AITherapist()

logger.info("InsightSphere AI backend initialized successfully")


@app.get("/", tags=["Health"])
async def root():
    """
    Health check endpoint.
    
    Returns:
        dict: Status message confirming the API is running
    """
    return {
        "message": "InsightSphere AI Backend Running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.post(
    "/analyze_text",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    tags=["Analysis"],
    summary="Analyze text for emotional content and patterns",
    responses={
        200: {
            "description": "Successful analysis",
            "model": AnalysisResponse
        },
        422: {
            "description": "Validation error",
            "model": ErrorResponse
        },
        500: {
            "description": "Server error",
            "model": ErrorResponse
        }
    }
)
async def analyze_text(request: AnalysisRequest):
    """
    Analyze user text for emotions, stress levels, and cognitive patterns.
    
    This endpoint performs comprehensive text analysis including:
    - Emotion detection (joy, sadness, anxiety, anger, calm)
    - Stress score calculation (0-100)
    - Cognitive distortion identification
    - Personalized coping suggestions and journaling prompts
    
    Args:
        request: AnalysisRequest containing the text to analyze
        
    Returns:
        AnalysisResponse: Complete analysis results with emotions, stress score,
                         cognitive distortions, summary, and suggestions
                         
    Raises:
        HTTPException: 422 for validation errors, 500 for processing errors
    """
    try:
        logger.info(f"Received analysis request (text length: {len(request.text)} chars)")
        
        # Perform NLP analysis
        analysis_result = text_analyzer.analyze_text(request.text)
        
        # Generate suggestions
        suggestions = suggestion_generator.generate_complete_suggestions(
            primary_emotion=analysis_result['primary_emotion'],
            stress_score=analysis_result['stress_score'],
            emotions=analysis_result['emotions'],
            cognitive_distortions=analysis_result['cognitive_distortions']
        )
        
        # Build response
        response = AnalysisResponse(
            emotions=analysis_result['emotions'],
            primary_emotion=analysis_result['primary_emotion'],
            stress_score=analysis_result['stress_score'],
            cognitive_distortions=analysis_result['cognitive_distortions'],
            summary=analysis_result['summary'],
            suggestions=suggestions,
            timestamp=analysis_result['timestamp']
        )
        
        logger.info(f"Analysis completed successfully: primary_emotion={response.primary_emotion}, stress_score={response.stress_score}")
        
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis failed, please try again"
        )


@app.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    tags=["Therapy Chat"],
    summary="Chat with AI therapist for personalized support",
    responses={
        200: {
            "description": "Successful chat response",
            "model": ChatResponse
        },
        422: {
            "description": "Validation error",
            "model": ErrorResponse
        },
        500: {
            "description": "Server error",
            "model": ErrorResponse
        }
    }
)
async def chat_with_therapist(request: ChatRequest):
    """
    Have a conversation with the AI therapist for personalized mental health support.
    
    This endpoint provides:
    - Empathetic, professional therapeutic responses
    - Context-aware conversation (remembers chat history)
    - Evidence-based guidance (CBT, mindfulness, etc.)
    - Crisis detection and resource provision
    - Personalized coping strategies
    
    Args:
        request: ChatRequest containing the user's message and conversation history
        
    Returns:
        ChatResponse: AI therapist's response with crisis assessment
                         
    Raises:
        HTTPException: 422 for validation errors, 500 for processing errors
    """
    try:
        logger.info(f"Received chat request (message length: {len(request.message)} chars)")
        
        # Assess crisis level
        crisis_assessment = ai_therapist.assess_crisis_level(request.message)
        
        # Generate AI response
        ai_response = ai_therapist.generate_response(
            user_message=request.message,
            conversation_history=request.conversation_history or [],
            emotional_context=request.emotional_context
        )
        
        # Get crisis resources if needed
        crisis_resources = None
        if crisis_assessment['crisis_detected']:
            crisis_resources = ai_therapist.get_crisis_resources()
            logger.warning(f"Crisis detected: {crisis_assessment['severity']} severity")
        
        from datetime import datetime
        
        response = ChatResponse(
            response=ai_response,
            crisis_detected=crisis_assessment['crisis_detected'],
            crisis_severity=crisis_assessment['severity'],
            crisis_resources=crisis_resources,
            timestamp=datetime.utcnow().isoformat() + 'Z'
        )
        
        logger.info("Chat response generated successfully")
        
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Processing error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Chat failed, please try again"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom exception handler for HTTP exceptions."""
    error_type = "validation_error" if exc.status_code == 422 else "server_error"
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_type": error_type
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Custom exception handler for unexpected errors."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
            "error_type": "server_error"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
