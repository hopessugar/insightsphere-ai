"""
API endpoint tests for InsightSphere AI.

These tests verify the FastAPI endpoints work correctly.
"""

import pytest
from fastapi.testclient import TestClient
from hypothesis import given, strategies as st, settings

from app import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "InsightSphere AI" in data["message"]
    assert data["status"] == "healthy"


# Feature: insightsphere-ai, Property 14: API response completeness
@given(st.text(min_size=20, max_size=500))
@settings(max_examples=50)
def test_api_response_completeness(text):
    """
    Property 14: API response completeness
    For any successful analysis, the API response must include all required fields.
    Validates: Requirements 2.5, 3.5, 5.5, 18.5
    """
    response = client.post(
        "/analyze_text",
        json={"text": text}
    )
    
    # Should return 200 OK
    assert response.status_code == 200
    
    data = response.json()
    
    # Check all required fields exist
    required_fields = [
        'emotions',
        'primary_emotion',
        'stress_score',
        'cognitive_distortions',
        'summary',
        'suggestions',
        'timestamp'
    ]
    
    for field in required_fields:
        assert field in data, f"Response missing required field: {field}"
    
    # Verify field types
    assert isinstance(data['emotions'], dict), "emotions must be a dict"
    assert isinstance(data['primary_emotion'], str), "primary_emotion must be a string"
    assert isinstance(data['stress_score'], (int, float)), "stress_score must be numeric"
    assert isinstance(data['cognitive_distortions'], list), "cognitive_distortions must be a list"
    assert isinstance(data['summary'], str), "summary must be a string"
    assert isinstance(data['suggestions'], list), "suggestions must be a list"
    assert isinstance(data['timestamp'], str), "timestamp must be a string"
    
    # Verify emotions dict has all 5 emotions
    assert len(data['emotions']) == 5, "emotions dict must have 5 emotions"
    for emotion in ['joy', 'sadness', 'anxiety', 'anger', 'calm']:
        assert emotion in data['emotions'], f"emotions missing {emotion}"


# Feature: insightsphere-ai, Property 26: API validation errors
@given(st.text(min_size=0, max_size=19))  # Too short
@settings(max_examples=30)
def test_api_validation_error_short_text(short_text):
    """
    Property 26: API validation errors
    For any invalid input (text too short), the API should return 422 with descriptive error.
    Validates: Requirements 12.4
    """
    response = client.post(
        "/analyze_text",
        json={"text": short_text}
    )
    
    # Should return 422 Unprocessable Entity
    assert response.status_code == 422
    
    data = response.json()
    
    # Should have error details
    assert "detail" in data or "error_type" in data


def test_api_validation_error_long_text():
    """Test that text exceeding max length returns 422."""
    long_text = "a" * 5001  # Exceeds 5000 char limit
    
    response = client.post(
        "/analyze_text",
        json={"text": long_text}
    )
    
    # Should return 422
    assert response.status_code == 422


def test_api_validation_error_missing_text():
    """Test that missing text field returns 422."""
    response = client.post(
        "/analyze_text",
        json={}
    )
    
    # Should return 422
    assert response.status_code == 422


# Feature: insightsphere-ai, Property 27: CORS header presence
def test_cors_headers():
    """
    Property 27: CORS header presence
    For any cross-origin request, the response should include appropriate CORS headers.
    Validates: Requirements 17.3, 17.4, 17.5
    """
    # Make a request with Origin header
    response = client.get(
        "/",
        headers={"Origin": "http://localhost:5173"}
    )
    
    # Check for CORS headers
    assert "access-control-allow-origin" in response.headers
    
    # Test OPTIONS preflight request
    response = client.options(
        "/analyze_text",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST"
        }
    )
    
    # Should have CORS headers
    assert "access-control-allow-origin" in response.headers or response.status_code == 200


def test_successful_analysis():
    """Test a complete successful analysis flow."""
    text = "I've been feeling really happy and excited about my new job. Everything is going great!"
    
    response = client.post(
        "/analyze_text",
        json={"text": text}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert data['primary_emotion'] in ['joy', 'sadness', 'anxiety', 'anger', 'calm']
    assert 0 <= data['stress_score'] <= 100
    assert 4 <= len(data['suggestions']) <= 6
    assert len(data['summary']) > 0


def test_high_stress_includes_safety_message():
    """Test that high stress text includes safety message in suggestions."""
    text = "I feel extremely overwhelmed and hopeless. Everything is terrible and I'm always anxious. Nothing ever works out."
    
    response = client.post(
        "/analyze_text",
        json={"text": text}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have high stress
    assert data['stress_score'] > 50  # Likely high stress
    
    # Check for safety-related keywords in suggestions
    suggestions_text = ' '.join(data['suggestions']).lower()
    safety_keywords = ['professional', 'counselor', 'therapist', 'support', 'help']
    has_safety = any(keyword in suggestions_text for keyword in safety_keywords)
    
    # High stress should trigger safety message
    if data['stress_score'] > 80:
        assert has_safety, "High stress should include safety message"
