# 🚀 Quick Deployment Commands

## Prerequisites
- GitHub account
- Code pushed to GitHub repository

---

## ⚡ Fastest Method: Vercel + Render

### 1. Deploy Backend (Render)
1. Go to https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Connect repository
5. Settings:
   ```
   Name: insightsphere-backend
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
6. Add environment variable:
   ```
   GEMINI_API_KEY=your_key_here
   ```
7. Deploy and copy URL

### 2. Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Update .env.production with your backend URL
echo "VITE_API_URL=https://your-backend-url.onrender.com" > .env.production

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3. Update Backend CORS
Go to Render → Environment → Update:
```
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

---

## 🎯 Alternative: Netlify + Railway

### 1. Deploy Backend (Railway)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repository
4. Add variables:
   ```
   GEMINI_API_KEY=your_key
   ```
5. Settings → Root Directory: `backend`
6. Copy URL

### 2. Deploy Frontend (Netlify)

```bash
cd frontend

# Build
npm run build

# Deploy
npx netlify-cli deploy --prod --dir=dist
```

Or drag `dist` folder to https://app.netlify.com/drop

---

## ✅ Verification

After deployment, test:
- [ ] Visit frontend URL
- [ ] Try Wellness Plan Generator
- [ ] Test Mood Tracking
- [ ] Check AI Chat
- [ ] Verify all features work

---

## 🔗 Your Live URLs

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-api.onrender.com
**API Docs**: https://your-api.onrender.com/docs

---

**Need help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.
