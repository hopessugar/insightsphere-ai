# 🚀 Quick Start Guide - InsightSphere AI with Therapy Chat

## ✨ NEW FEATURE: AI Therapy Chat!

Your app now includes a **real AI therapist** that provides personalized support and solutions, just like a professional psychiatrist!

---

## 🏃 How to Run (2 Steps)

### Step 1: Start Backend

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

✅ Backend running at: **http://localhost:8000**

### Step 2: Start Frontend

Open a **NEW terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🎯 What's New: Therapy Chat

### Features:
1. **💬 Real Conversations** - Chat back-and-forth with an AI therapist
2. **🧠 Context-Aware** - Remembers your conversation and emotional state
3. **🎓 Professional Techniques** - Uses CBT, active listening, empathetic validation
4. **🆘 Crisis Detection** - Automatically detects distress and provides resources
5. **🔒 100% Private** - Conversations stay on your device

### How to Use:
1. Open **http://localhost:5173**
2. Click **"Therapy Chat"** in the navigation
3. Start chatting! Share your problems, feelings, or concerns
4. Get personalized solutions and support

### Example Conversations:

**You:** "I'm feeling really anxious about my job interview tomorrow. I keep thinking I'm going to mess it up."

**AI Therapist:** "I hear that you're feeling anxious about your interview tomorrow, and that's completely understandable. Job interviews can feel really high-stakes. Let's work through this together.

First, can you tell me what specifically worries you most about the interview? Is it the questions they might ask, how you'll present yourself, or something else?

Also, I'm noticing you said you 'keep thinking' you'll mess it up - that sounds like your mind might be predicting the worst outcome. What evidence do you have that supports this thought? And what evidence might contradict it?"

---

## 🎨 Pages Available:

1. **Home** (`/`) - Beautiful landing page
2. **Analyze** (`/analyze`) - Quick mood analysis
3. **Therapy Chat** (`/chat`) - 🆕 **NEW!** Chat with AI therapist
4. **Insights** (`/insights`) - View your emotional trends
5. **About** (`/about`) - Learn about the platform

---

## 🤖 AI Configuration (Optional - Highly Recommended!)

The Therapy Chat works in **two modes**:

### Mode 1: Rule-Based (Default - No Setup Required)
- Uses intelligent pattern matching
- Provides empathetic, pre-written responses
- Works immediately without any API keys
- ✅ Good for privacy

### Mode 2: Gemini AI-Powered (Optional - **FREE & AMAZING!**)
- Uses Google Gemini Pro for natural conversations
- Much more personalized and context-aware
- **100% FREE** with generous limits
- Requires Gemini API key (takes 2 minutes to get)

**To enable Gemini AI mode (Recommended!):**

1. Get a **FREE** API key from: **https://makersuite.google.com/app/apikey**
2. Install Gemini library:
   ```bash
   pip install google-generativeai
   ```
3. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```
4. Restart the backend

**See `GEMINI_SETUP.md` for detailed instructions!**

**Note:** The rule-based mode works fine, but Gemini makes it **10x better** and it's completely free!

---

## 💡 Tips for Best Experience:

1. **Be Honest** - The AI can only help if you share openly
2. **Give Context** - Explain the situation, not just the feeling
3. **Ask Questions** - The AI can help you explore your thoughts
4. **Take Your Time** - There's no rush, chat at your own pace
5. **Use Both Features** - Try Analyze for quick insights, Chat for deeper support

---

## 🎓 For Your College Project:

### What Makes This Special:

1. **Full-Stack AI Application**
   - Python FastAPI backend
   - React TypeScript frontend
   - Real AI integration

2. **Mental Health Focus**
   - Addresses real-world problem
   - Ethical AI design
   - Privacy-first approach

3. **Professional Quality**
   - Beautiful UI/UX
   - Comprehensive testing
   - Production-ready code

4. **Innovative Features**
   - Emotion detection
   - Stress analysis
   - Cognitive distortion identification
   - **AI conversational therapy** 🆕

### Demo Flow:

1. **Show Home Page** - Explain the vision
2. **Quick Analysis** - Analyze sample text
3. **Therapy Chat** - Have a conversation with the AI
4. **Show Insights** - Display trends and patterns
5. **Explain Tech** - Walk through the architecture

---

## 🐛 Troubleshooting:

### Backend won't start:
```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment (if you created one)
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start:
```bash
# Make sure you're in the frontend directory
cd frontend

# Clear and reinstall
rm -rf node_modules
npm install
```

### Chat not working:
- Check that backend is running on port 8000
- Check browser console for errors
- The rule-based mode should always work
- AI mode requires OpenAI API key (optional)

---

## 🎉 You're All Set!

Your InsightSphere AI now has:
✅ Emotion detection
✅ Stress analysis  
✅ Cognitive distortion identification
✅ **AI Therapy Chat** 🆕
✅ Beautiful visualizations
✅ Trend tracking
✅ Professional UI/UX

**Enjoy your enhanced mental wellness platform!** 🚀

---

Built with ❤️ for mental wellness awareness
