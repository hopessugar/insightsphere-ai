# 🚀 Deployment Guide - InsightSphere AI

Complete guide to deploy your full-stack application to the web for FREE!

---

## 📋 Table of Contents

- [Quick Deploy (Recommended)](#-quick-deploy-recommended)
- [Option 1: Vercel + Render](#-option-1-vercel--render)
- [Option 2: Netlify + Railway](#-option-2-netlify--railway)
- [Option 3: All Render](#-option-3-all-render)
- [Post-Deployment](#-post-deployment)
- [Custom Domain](#-custom-domain)
- [Troubleshooting](#-troubleshooting)

---

## ⚡ Quick Deploy (Recommended)

**Best combination**: Vercel (Frontend) + Render (Backend)

**Why?**
- ✅ 100% Free
- ✅ Auto-deploys on git push
- ✅ SSL certificates included
- ✅ Fast global CDN
- ✅ Easy to configure

**Time**: 15-20 minutes

---

## 🎯 Option 1: Vercel + Render

### Part A: Deploy Backend on Render

#### Step 1: Create Render Account
1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** to link GitHub
3. Select your `insightsphere-ai` repository
4. Click **"Connect"**

#### Step 3: Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `insightsphere-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

#### Step 4: Add Environment Variables
1. Scroll to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add these:

```
GEMINI_API_KEY=your_actual_api_key_here
CORS_ORIGINS=http://localhost:5173,https://your-frontend-url.vercel.app
LOG_LEVEL=INFO
```

**Note**: You'll update `CORS_ORIGINS` after deploying frontend

#### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deployment
3. Once deployed, copy your backend URL
   - Example: `https://insightsphere-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend!

---

### Part B: Deploy Frontend on Vercel

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Update Environment File

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://insightsphere-backend.onrender.com
```

Replace with your actual Render backend URL!

#### Step 3: Deploy

```bash
# Navigate to frontend folder
cd frontend

# Login to Vercel (opens browser)
vercel login

# Deploy (follow prompts)
vercel

# Prompts:
# ? Set up and deploy? → Yes
# ? Which scope? → Your account
# ? Link to existing project? → No
# ? What's your project's name? → insightsphere-ai
# ? In which directory is your code located? → ./
# ? Want to override the settings? → No

# Wait for deployment...
# Copy the preview URL

# Deploy to production
vercel --prod
```

#### Step 4: Get Your Live URL
- After deployment, you'll get a URL like:
  - `https://insightsphere-ai.vercel.app`
- **Save this URL!**

#### Step 5: Update Backend CORS
1. Go back to Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://insightsphere-ai.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

#### Step 6: Test Your App
1. Visit your Vercel URL
2. Try all features:
   - ✅ Wellness Plan Generator
   - ✅ Mood Tracking
   - ✅ AI Chat
   - ✅ Shadow Work
   - ✅ Emotional Recipes
   - ✅ Healing Mirror

**🎉 Your app is now LIVE!**

---

## 🎯 Option 2: Netlify + Railway

### Part A: Deploy Backend on Railway

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `insightsphere-ai`
4. Railway will detect Python automatically

#### Step 3: Configure
1. Click on your service
2. Go to **"Variables"** tab
3. Add:
   ```
   GEMINI_API_KEY=your_api_key
   CORS_ORIGINS=https://your-netlify-url.netlify.app
   ```
4. Go to **"Settings"** tab
5. Set **"Root Directory"** to `backend`
6. Set **"Start Command"** to `uvicorn app:app --host 0.0.0.0 --port $PORT`

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment
3. Go to **"Settings"** → **"Networking"**
4. Click **"Generate Domain"**
5. Copy your backend URL

---

### Part B: Deploy Frontend on Netlify

#### Step 1: Build Frontend

```bash
cd frontend

# Update .env.production with your Railway backend URL
# VITE_API_URL=https://your-railway-url.up.railway.app

# Build
npm run build
```

#### Step 2: Deploy to Netlify

**Method A: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com/drop
2. Drag the `frontend/dist` folder onto the page
3. Wait for upload
4. Done! Copy your URL

**Method B: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Method C: GitHub Integration**
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub
4. Select repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL` = your Railway backend URL
7. Click **"Deploy"**

#### Step 3: Update Backend CORS
Go back to Railway and update `CORS_ORIGINS` with your Netlify URL

---

## 🎯 Option 3: All Render

Deploy both on Render for simplicity.

### Step 1: Deploy Backend
Follow **Option 1, Part A** above

### Step 2: Deploy Frontend as Static Site
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: `insightsphere-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = your backend URL
5. Click **"Create Static Site"**

### Step 3: Update Backend CORS
Update `CORS_ORIGINS` with your frontend URL

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Backend API is accessible
- [ ] Wellness Plan Generator works
- [ ] Mood tracking saves data
- [ ] AI Chat responds (with or without Gemini)
- [ ] All navigation links work
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled (automatic)

---

## 🌐 Custom Domain (Optional)

### For Vercel:
1. Go to project settings
2. Click **"Domains"**
3. Add your domain
4. Update DNS records as instructed

### For Netlify:
1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow DNS configuration steps

### For Render:
1. Go to service settings
2. Click **"Custom Domain"**
3. Add domain and configure DNS

---

## 🔧 Environment Variables Reference

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=https://your-frontend-url.com
LOG_LEVEL=INFO
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms**: API errors, features not working

**Solutions**:
1. Check `VITE_API_URL` in frontend environment variables
2. Verify backend is running (visit backend URL)
3. Check CORS settings in backend
4. Look at browser console for errors

### Issue: Backend deployment fails

**Symptoms**: Build errors on Render/Railway

**Solutions**:
1. Check `requirements.txt` is in `backend/` folder
2. Verify Python version compatibility
3. Check build logs for specific errors
4. Ensure all dependencies are listed

### Issue: Gemini API not working

**Symptoms**: Chat uses fallback responses

**Solutions**:
1. Verify `GEMINI_API_KEY` is set correctly
2. Check API key is valid
3. Verify API quota/limits
4. Check backend logs for errors

### Issue: 404 errors on page refresh

**Symptoms**: Direct URLs don't work

**Solutions**:

**Vercel**: Add `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Add `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Build fails on frontend

**Symptoms**: Deployment fails during build

**Solutions**:
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all dependencies in `package.json`
4. Check build logs for specific errors

### Issue: Slow backend response

**Symptoms**: Long loading times

**Solutions**:
1. Render free tier sleeps after inactivity (first request is slow)
2. Consider upgrading to paid tier
3. Or use Railway (doesn't sleep)
4. Add loading states in frontend

---

## 📊 Monitoring

### Check Backend Health
Visit: `https://your-backend-url.com/`

Should return:
```json
{
  "message": "InsightSphere AI Backend is running",
  "status": "healthy"
}
```

### Check API Docs
Visit: `https://your-backend-url.com/docs`

Interactive API documentation

### View Logs

**Render**:
- Dashboard → Your service → Logs tab

**Railway**:
- Project → Service → Deployments → View logs

**Vercel**:
- Project → Deployments → Click deployment → View logs

---

## 🔄 Continuous Deployment

Once set up, deployments are automatic:

1. **Make changes** to your code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. **Auto-deploy** happens automatically!
4. **Check deployment** status in dashboard

---

## 💰 Cost Breakdown

### Free Tier Limits

**Vercel**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

**Render**:
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 512 MB RAM

**Railway**:
- ✅ $5 free credit/month
- ✅ No sleep
- ✅ 512 MB RAM
- ⚠️ Credit-based (may run out)

**Netlify**:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS

### Recommended for Production

If you get users and need better performance:
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Render Starter ($7/month) or Railway Pro ($5/month)

---

## 🎓 Next Steps

After deployment:

1. **Share your app**: Send the URL to friends/family
2. **Add to portfolio**: Include in your resume/portfolio
3. **Monitor usage**: Check analytics in dashboards
4. **Gather feedback**: Ask users for improvements
5. **Iterate**: Keep improving based on feedback

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Check platform documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Docs](https://render.com/docs)
   - [Railway Docs](https://docs.railway.app)
   - [Netlify Docs](https://docs.netlify.com)
3. Check deployment logs
4. Search for error messages online

---

**🎉 Congratulations on deploying your app!**

Your InsightSphere AI is now accessible to anyone in the world! 🌍

---

<div align="center">

[⬆ Back to Top](#-deployment-guide---insightsphere-ai)

</div>
