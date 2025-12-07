# 🤖 Gemini AI Integration Setup

## Why Gemini?

Google Gemini is **FREE** and provides:
- ✅ Natural, human-like conversations
- ✅ Context-aware responses
- ✅ Better understanding of emotions
- ✅ More accurate and helpful advice
- ✅ 60 requests per minute (free tier)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Free Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy your API key

### Step 2: Add API Key to Your App

Open `backend/.env` and add:

```
GEMINI_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with the key you copied.

### Step 3: Install Gemini Library

In your backend terminal:

```bash
pip install google-generativeai
```

### Step 4: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Start again:
uvicorn app:app --reload --port 8000
```

### Step 5: Test It!

1. Go to **http://localhost:5173/chat**
2. Send a message like: *"I'm feeling anxious about my future"*
3. Get intelligent, empathetic AI responses! 🎉

---

## 🆚 Comparison: Rule-Based vs Gemini AI

### Without Gemini (Rule-Based):
**You:** "I'm feeling anxious about my exams"

**Bot:** "I hear that you're feeling anxious, and that can be really overwhelming. Anxiety is your body's way of trying to protect you, even when it feels uncomfortable. Let's try something together: Can you take a slow, deep breath with me?"

✅ Good, but generic

### With Gemini AI:
**You:** "I'm feeling anxious about my exams"

**Bot:** "I understand exam anxiety can feel really overwhelming. It sounds like you're carrying a lot of pressure right now. Can you tell me more about what specifically worries you most about the exams? Is it the material itself, the time pressure, or maybe concerns about the results? Understanding the root of your anxiety can help us work through it together."

✅ More personalized and conversational!

---

## 💡 Features with Gemini

1. **Context Memory** - Remembers your conversation
2. **Personalized Advice** - Tailored to your specific situation
3. **Follow-up Questions** - Asks relevant questions to understand better
4. **Emotional Intelligence** - Better understanding of nuanced emotions
5. **Natural Conversation** - Feels like talking to a real therapist

---

## 🔒 Privacy & Safety

- Your API key is stored locally in `.env`
- Conversations are sent to Google's servers for processing
- Google may use data to improve their models
- For maximum privacy, use the rule-based mode (no API key)

---

## 🆓 Free Tier Limits

- **60 requests per minute**
- **1,500 requests per day**
- More than enough for personal use!

If you exceed limits, the app automatically falls back to rule-based responses.

---

## 🐛 Troubleshooting

### "Module not found: google.generativeai"
```bash
pip install google-generativeai
```

### "API key not valid"
- Check that you copied the full key
- Make sure there are no extra spaces
- Verify the key at: https://makersuite.google.com/app/apikey

### Still using rule-based responses?
- Check that `GEMINI_API_KEY` is in `backend/.env`
- Restart the backend server
- Check backend terminal for error messages

---

## 🎯 Recommendation

**For College Project Demo:**
- ✅ **Use Gemini** - Shows real AI integration
- ✅ **Free** - No cost
- ✅ **Impressive** - Much better responses
- ✅ **Easy Setup** - Just 5 minutes

**For Privacy-Conscious Users:**
- ✅ **Skip Gemini** - Use rule-based mode
- ✅ **100% Local** - No data sent to external servers
- ✅ **Still Good** - Intelligent pattern-based responses

---

## 📚 Learn More

- Gemini API Docs: https://ai.google.dev/docs
- Get API Key: https://makersuite.google.com/app/apikey
- Pricing: https://ai.google.dev/pricing

---

**Enjoy your AI-powered therapy chat!** 🚀
