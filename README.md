# 🧠 InsightSphere AI - Mental Wellness Platform

<div align="center">

![InsightSphere AI](https://img.shields.io/badge/InsightSphere-AI-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.13-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A comprehensive, AI-powered mental health and wellness platform with personalized treatment plans, mood tracking, and therapeutic tools.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## � Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Application Structure](#-application-structure)
- [Features Documentation](#-features-documentation)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

InsightSphere AI is a production-ready, full-stack mental wellness application that combines evidence-based psychological techniques with modern AI technology. It provides users with:

- **Personalized Wellness Plans**: Psychiatrist-level treatment plans tailored to 17+ mental health conditions
- **Mood Tracking & Analytics**: Comprehensive tracking with AI-powered pattern recognition
- **AI Therapy Chat**: Supportive conversations with crisis detection and resource provision
- **Specialized Tools**: Shadow Work, Emotional Recipes, and Healing Mirror features
- **Privacy-First**: All data stored locally, no external tracking

### 🎯 Key Differentiators

- **Clinical-Grade**: Evidence-based protocols matching professional psychiatric care
- **Comprehensive**: Covers anxiety, depression, PTSD, OCD, ADHD, insomnia, and more
- **Beautiful UI**: Premium glassmorphism design with smooth animations
- **Offline-First**: Works without internet, data stored locally
- **Free & Open Source**: No subscriptions, no data collection

---

## ✨ Features

### 1. 🧘 Personalized Wellness Plans

**Comprehensive mental health treatment planning system**

- **15-Question Assessment**: Covers condition, severity, symptoms, triggers, lifestyle
- **17+ Conditions Supported**: 
  - Anxiety Disorders (GAD, Panic, Social Anxiety)
  - Depression (Major, Dysthymia, Bipolar)
  - PTSD & Trauma
  - OCD
  - ADHD
  - Insomnia & Sleep Disorders
  - Eating Disorders
  - Substance Use
  - BPD, SAD, Burnout, Grief

- **Detailed Daily Schedules**: Hour-by-hour routines optimized for your condition
- **Evidence-Based Exercises**: CBT, DBT, ERP, mindfulness techniques with exact instructions
- **Lifestyle Recommendations**: Sleep hygiene, nutrition, exercise, social connection
- **Weekly Goals**: Personalized, achievable milestones

### 2. 📊 Insights & Mood Tracking

**Professional-grade mental health analytics**

- **Quick Daily Log** (30 seconds):
  - Mood rating (0-10)
  - Energy level
  - Anxiety level
  - Sleep quality
  - Activities (exercise, social, meditation)
  - Optional notes

- **Wellness Score** (0-100): Calculated from multiple factors
- **Streak Tracking**: Build consistency with daily check-ins
- **AI Pattern Detection**:
  - Exercise correlation with mood
  - Social interaction impact
  - Sleep quality effects
  - Day-of-week patterns
  - Meditation benefits
  - Confidence scores (70-95%)

- **Comprehensive Charts**:
  - 30-day mood trends
  - Wellness radar (6-axis balance)
  - Individual metric tracking
  - Activity correlations

- **Journal Timeline**: Full history with context and notes

### 3. 💬 AI Therapy Chat

**Supportive AI conversations with crisis detection**

- **Dual Mode**:
  - Rule-based fallback (always works)
  - Google Gemini API integration (enhanced responses)

- **Features**:
  - Empathetic, non-judgmental responses
  - Crisis keyword detection
  - Resource provision (988 Suicide & Crisis Lifeline)
  - Conversation history
  - Real-time messaging UI

- **Safety First**: Not a replacement for professional care, provides supportive guidance

### 4. 🌑 Shadow Work AI

**Talk to your subconscious**

- AI acts as your hidden self
- Deep probing questions
- Pattern recognition
- Integration of shadow aspects
- Safety warnings and boundaries
- Intro screen explaining shadow work

### 5. 🍳 Emotional Recipes

**Cook your feelings into solutions**

- **6 Emotion Recipes**:
  - Anxiety → Calm Mind Soufflé
  - Sadness → Comfort Soul Stew
  - Anger → Rage Release Reduction
  - Stress → Pressure Cooker Antidote
  - Loneliness → Connection Casserole
  - Joy → Happiness Amplifier

- Each recipe includes:
  - Prep time & difficulty
  - Ingredients (techniques)
  - Step-by-step instructions
  - Benefits
  - Completion tracking

### 6. 🪞 The Healing Mirror

**Discover your hidden blind spots**

- Analyzes text (50+ characters)
- Identifies:
  - Emotional triggers
  - Cognitive patterns
  - Blind spots
  - Why you react certain ways
  - Deeper truths
  - Actionable insights

- Generates 3 personalized insights
- Based on emotions and cognitive distortions
- Categories: Trigger, Pattern, Blind Spot, Why, Truth, Action

---

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.13
- **NLP**: TextBlob, NLTK
- **AI**: Google Generative AI (Gemini)
- **Testing**: Pytest, Hypothesis (property-based testing)
- **CORS**: Enabled for frontend communication

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP**: Axios

### Development
- **Package Manager**: npm (frontend), pip (backend)
- **Environment**: Python venv
- **Hot Reload**: Vite HMR, FastAPI auto-reload

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+** (with pip)
- **Node.js 18+** (with npm)
- **Git**

### Installation (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd insightsphere-ai

# 2. Backend Setup
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# 3. Frontend Setup
cd ../frontend
npm install

# 4. Environment Configuration
# Backend: Copy backend/.env.example to backend/.env
# Add your Gemini API key (optional, works without it)

# 5. Run the application
# Terminal 1 - Backend:
cd backend
venv\Scripts\activate  # Windows
uvicorn app:app --reload --port 8000

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📖 Detailed Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for comprehensive setup instructions including:
- Python 3.13 installation
- Virtual environment setup
- Dependency installation
- Environment configuration
- Troubleshooting common issues

See [GEMINI_SETUP.md](GEMINI_SETUP.md) for Gemini API integration.

See [QUICK_START.md](QUICK_START.md) for rapid deployment.

---

## 📁 Application Structure

```
insightsphere-ai/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── core/
│   │   ├── models_nlp.py      # NLP emotion detection
│   │   ├── suggestions.py     # Suggestion engine
│   │   └── ai_therapist.py    # AI chat functionality
│   ├── schemas/
│   │   └── analysis.py        # Pydantic models
│   ├── tests/
│   │   ├── test_api.py        # API tests
│   │   ├── test_unit.py       # Unit tests
│   │   └── test_properties.py # Property-based tests
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── WellnessPlan.tsx      # Treatment plans
│   │   │   ├── Insights.tsx          # Mood tracking
│   │   │   ├── TherapyChat.tsx       # AI chat
│   │   │   ├── ShadowWork.tsx        # Shadow work
│   │   │   ├── EmotionalRecipes.tsx  # Recipes
│   │   │   ├── HealingMirror.tsx     # Mirror
│   │   │   └── About.tsx             # About page
│   │   ├── components/
│   │   │   ├── Layout/        # Navbar, Footer, Layout
│   │   │   ├── UI/            # Button, Card, ProgressBar
│   │   │   └── Analysis/      # Charts, Results
│   │   ├── utils/
│   │   │   ├── api.ts         # API client
│   │   │   ├── types.ts       # TypeScript types
│   │   │   └── localStorage.ts # Local storage
│   │   └── hooks/
│   │       └── useAnalysis.ts # Custom hooks
│   ├── package.json           # npm dependencies
│   └── vite.config.ts         # Vite configuration
│
├── README.md                  # This file
├── SETUP_GUIDE.md            # Detailed setup
├── GEMINI_SETUP.md           # Gemini API setup
└── QUICK_START.md            # Quick start guide
```

---

## 📚 Features Documentation

### Wellness Plan Generator

**Purpose**: Generate psychiatrist-level treatment plans

**How It Works**:
1. User completes 15-question assessment
2. System analyzes: condition, severity, symptoms, triggers, lifestyle
3. Generates personalized plan with:
   - Daily schedule (hour-by-hour)
   - Mind exercises (CBT, DBT, ERP techniques)
   - Lifestyle tips (sleep, nutrition, exercise)
   - Weekly goals

**Key Algorithms**:
- Condition-specific schedule generation
- Symptom-based exercise selection
- Trigger-aware recommendations
- Activity level adaptation

**Data Storage**: None (generated on-demand)

### Insights & Mood Tracking

**Purpose**: Track mental health progress and detect patterns

**How It Works**:
1. User logs daily mood, energy, anxiety, sleep, activities
2. Data stored in browser localStorage
3. System calculates:
   - Wellness score (weighted average)
   - Streak (consecutive days)
   - Averages (7-day, 30-day)
   - Correlations (exercise→mood, social→mood, etc.)
4. AI detects patterns with confidence scores

**Key Algorithms**:
- Wellness score: `(mood*0.3 + energy*0.2 + (10-anxiety)*0.2 + sleep*0.15 + exercise*0.1 + social*0.05) * 10`
- Pattern detection: Statistical correlation analysis
- Streak calculation: Consecutive day counting

**Data Storage**: Browser localStorage (JSON)

### AI Therapy Chat

**Purpose**: Provide supportive conversations

**How It Works**:
1. User sends message
2. System checks for crisis keywords
3. If Gemini API available: AI-generated response
4. Else: Rule-based response
5. Crisis resources shown if needed

**Crisis Keywords**: suicide, kill myself, end it all, want to die, etc.

**Data Storage**: Session-based (not persisted)

### Shadow Work AI

**Purpose**: Explore subconscious patterns

**How It Works**:
1. AI takes role of user's subconscious
2. Asks deep, probing questions
3. Helps process fears, insecurities, trauma
4. Provides pattern recognition

**Safety**: Intro screen with warnings, not for crisis situations

### Emotional Recipes

**Purpose**: Gamify mental health techniques

**How It Works**:
1. User selects emotion (anxiety, sadness, anger, etc.)
2. System provides "recipe" with:
   - Ingredients (techniques)
   - Instructions (step-by-step)
   - Benefits
3. User can track completion

**Metaphor**: Cooking = Healing process

### Healing Mirror

**Purpose**: Reveal blind spots and patterns

**How It Works**:
1. User writes about situation/feeling (50+ chars)
2. System analyzes using NLP
3. Detects emotions and cognitive distortions
4. Generates 3 insights:
   - Trigger detected
   - Your pattern
   - Your blind spot
   - Why you react this way
   - The deeper truth
   - What you can do

**Analysis**: Uses backend `/analyze_text` endpoint

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /
```
**Response**:
```json
{
  "message": "InsightSphere AI Backend is running",
  "status": "healthy"
}
```

#### 2. Analyze Text
```http
POST /analyze_text
Content-Type: application/json

{
  "text": "I feel anxious about the upcoming presentation..."
}
```

**Response**:
```json
{
  "text": "I feel anxious...",
  "emotions": {
    "joy": 0.1,
    "sadness": 0.2,
    "anxiety": 0.8,
    "anger": 0.1,
    "calm": 0.1,
    "primary_emotion": "anxiety"
  },
  "stress_score": 75,
  "cognitive_distortions": ["catastrophizing", "overgeneralization"],
  "suggestions": ["Practice deep breathing...", "..."],
  "timestamp": "2025-12-07T18:30:00Z"
}
```

#### 3. Chat
```http
POST /chat
Content-Type: application/json

{
  "message": "I'm feeling overwhelmed today",
  "conversation_history": []
}
```

**Response**:
```json
{
  "response": "I hear that you're feeling overwhelmed...",
  "timestamp": "2025-12-07T18:30:00Z",
  "crisis_detected": false,
  "resources": []
}
```

### Error Responses

```json
{
  "detail": "Error message here"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
venv\Scripts\activate  # Windows
pytest
```

**Test Coverage**:
- **Unit Tests** (`test_unit.py`): Core functionality
- **API Tests** (`test_api.py`): Endpoint testing
- **Property Tests** (`test_properties.py`): Property-based testing with Hypothesis

**Run Specific Tests**:
```bash
pytest tests/test_api.py -v
pytest tests/test_properties.py -v
pytest -k "test_analyze" -v
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🚢 Deployment

### Backend Deployment

**Option 1: Docker**
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Option 2: Heroku**
```bash
heroku create insightsphere-api
git push heroku main
```

**Option 3: Railway/Render**
- Connect GitHub repository
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Option 3: GitHub Pages**
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables

**Backend** (`.env`):
```env
GEMINI_API_KEY=your_api_key_here  # Optional
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000  # Update for production
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Python 3.13 Compatibility
**Problem**: Package installation fails
**Solution**: Use updated package versions in `requirements.txt`

#### 2. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Check CORS settings in `backend/app.py`

#### 3. Gemini API Not Working
**Problem**: Chat uses fallback responses
**Solution**: 
- Check API key in `.env`
- Verify model name: `models/gemini-2.0-flash-exp`
- Check API quota/limits

#### 4. Port Already in Use
**Problem**: `Address already in use`
**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

#### 5. Module Not Found
**Problem**: `ModuleNotFoundError`
**Solution**:
```bash
# Ensure venv is activated
pip install -r requirements.txt
```

### Debug Mode

**Backend**:
```bash
uvicorn app:app --reload --log-level debug
```

**Frontend**:
```bash
npm run dev -- --debug
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/insightsphere-ai.git
cd insightsphere-ai
```

### 2. Create Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow existing code style
- Add tests for new features
- Update documentation

### 4. Test
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Describe your changes
- Link related issues
- Wait for review

### Code Style

**Python**:
- PEP 8
- Type hints
- Docstrings

**TypeScript/React**:
- ESLint rules
- Functional components
- TypeScript strict mode

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **NLP**: TextBlob, NLTK
- **AI**: Google Gemini
- **UI**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Pytest, Hypothesis

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/insightsphere-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/insightsphere-ai/discussions)
- **Email**: support@insightsphere.ai

---

## 🗺 Roadmap

### v2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Export data (PDF, CSV)
- [ ] Multi-language support
- [ ] Voice journaling
- [ ] Wearable integration
- [ ] Therapist dashboard
- [ ] Group support features

### v1.1 (Current)
- [x] Wellness Plan Generator
- [x] Mood Tracking & Analytics
- [x] AI Therapy Chat
- [x] Shadow Work
- [x] Emotional Recipes
- [x] Healing Mirror

---

<div align="center">

**Made with ❤️ for mental health awareness**

[⬆ Back to Top](#-insightsphere-ai---mental-wellness-platform)

</div>
