# InsightSphere AI - Backend API

FastAPI-based backend for emotional analysis and mental wellness insights.

## Setup

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create environment file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

4. Edit `.env` if needed (default values work for local development)

## Running the Server

### Development Mode

```bash
uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Production Mode

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:

- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative docs (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### Health Check

```
GET /
```

Returns server status.

### Analyze Text

```
POST /analyze_text
```

**Request Body:**
```json
{
  "text": "I've been feeling anxious about my exams...",
  "user_id": null
}
```

**Response:**
```json
{
  "emotions": {
    "joy": 0.2,
    "sadness": 0.3,
    "anxiety": 0.6,
    "anger": 0.1,
    "calm": 0.2
  },
  "primary_emotion": "anxiety",
  "stress_score": 65.5,
  "cognitive_distortions": ["catastrophizing"],
  "summary": "You're feeling anxiety with moderate stress...",
  "suggestions": [
    "Try the 5-4-3-2-1 grounding technique...",
    "Practice deep breathing...",
    "What specific worries are on your mind?"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing

### Run All Tests

```bash
pytest
```

### Run Specific Test Files

```bash
# Unit tests
pytest tests/test_unit.py

# Property-based tests
pytest tests/test_properties.py

# API tests
pytest tests/test_api.py
```

### Run with Coverage

```bash
pytest --cov=core --cov=schemas --cov=app
```

### Run Property Tests with More Examples

```bash
pytest tests/test_properties.py --hypothesis-show-statistics
```

## Project Structure

```
backend/
├── app.py                 # FastAPI application
├── core/
│   ├── models_nlp.py      # NLP analysis engine
│   └── suggestions.py     # Suggestions generator
├── schemas/
│   └── analysis.py        # Pydantic models
├── tests/
│   ├── test_unit.py       # Unit tests
│   ├── test_properties.py # Property-based tests
│   └── test_api.py        # API endpoint tests
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables
```

## Development Guidelines

### Code Style

- Follow PEP 8 style guide
- Use type hints for all functions
- Add docstrings to all classes and functions
- Keep functions focused and single-purpose

### Adding New Features

1. Update schemas in `schemas/analysis.py` if needed
2. Implement core logic in `core/` modules
3. Add endpoint in `app.py`
4. Write tests (unit + property-based)
5. Update API documentation

### Error Handling

The API returns structured error responses:

```json
{
  "detail": "Error message",
  "error_type": "validation_error|processing_error|server_error"
}
```

## Environment Variables

- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: `http://localhost:5173,http://localhost:3000`)
- `LOG_LEVEL`: Logging level (default: `INFO`)

## Troubleshooting

### Import Errors

Make sure you're in the backend directory and the virtual environment is activated:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### Port Already in Use

If port 8000 is already in use, specify a different port:

```bash
uvicorn app:app --reload --port 8001
```

### CORS Errors

Update the `CORS_ORIGINS` in `.env` to include your frontend URL.

## License

This project is for educational purposes.
