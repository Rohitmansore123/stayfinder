# 🚀 StayFinder Deployment Setup - Quick Start Guide

## What Was Created For You

I've prepared your project for deployment with the following files:

1. **vercel.json** - Vercel configuration for frontend build & deployment
2. **railway.json** - Railway configuration for backend deployment
3. **client/.env.production** - Frontend production environment template
4. **DEPLOYMENT.md** - Complete step-by-step deployment guide
5. **DEPLOYMENT_CHECKLIST.md** - Interactive checklist for deployment

---

## 30-Second Overview

Your StayFinder app will be deployed in 3 parts:

```
Code (GitHub)
    ↓
Frontend (React) → Vercel
Backend (Node.js) → Railway or Render
Database (MongoDB) → MongoDB Atlas or your own
```

---

## Quick Steps to Deploy

### 1️⃣ GitHub (5 minutes)

```bash
cd c:\Users\ASUS\OneDrive\Desktop\projects\stayfinder

git init
git add .
git commit -m "Deploy to Vercel and Railway"
git remote add origin https://github.com/YOUR_USERNAME/stayfinder.git
git push -u origin main
```

> Create a GitHub account at github.com if you don't have one

---

### 2️⃣ Frontend to Vercel (2 minutes)

1. Go to **vercel.com/new**
2. Click "Import Git Repository"
3. Paste your GitHub repo URL
4. Click "Import"
5. Settings auto-detect ✅ (build command, output folder, etc.)
6. Click "Deploy"
7. Wait ~2 minutes for build
8. **Copy your Vercel URL** (looks like: `https://stayfinder-xxxx.vercel.app`)

---

### 3️⃣ Backend to Railway (3 minutes)

1. Go to **railway.app** → Sign up with GitHub
2. Click "New Project" → "GitHub Repo"
3. Select your stayfinder repo
4. Click "Deploy"
5. Go to "Variables" tab
6. Add these environment variables:

```
PORT=5000
NODE_ENV=production
MONGO_URI=<get_this_from_mongodb_atlas>
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"">
CLOUDINARY_CLOUD_NAME=<if_you_have>
CLOUDINARY_API_KEY=<if_you_have>
CLOUDINARY_API_SECRET=<if_you_have>
FRONTEND_URL=https://your-vercel-url.vercel.app
STRIPE_SECRET_KEY=<optional>
```

7. Click "Railway Networking" → Copy your domain (ex: `https://stayfinder-xxxx.railway.app`)

---

### 4️⃣ Connect Frontend to Backend (1 minute)

1. Go to **Vercel Dashboard** → Your Project → Settings
2. Click "Environment Variables"
3. Add variable: `REACT_APP_API_URL` = `https://your-railway-url.railway.app/api`
4. Vercel auto-redeploys ✅

---

### 5️⃣ Get MongoDB (5 minutes)

If you don't have production MongoDB:

1. Go to **mongodb.com/cloud/atlas**
2. Create free account
3. Create free cluster
4. Get connection string
5. Add to Railway Variables: `MONGO_URI=<string>`

> OR restore from backup: `backup/stayfinder/` folders

---

## Test Your Deployment

1. Visit your Vercel URL: `https://your-domain.vercel.app`
2. Open DevTools (F12) → Console
3. Try: Register → Login
4. API calls should succeed ✅

---

## Troubleshooting

### Frontend shows blank page

- Check DevTools Console for JS errors
- Verify Vercel build logs

### API calls fail

- Check `REACT_APP_API_URL` in Vercel is correct
- Verify `FRONTEND_URL` in Railway matches Vercel domain
- Check Railway logs for backend errors

### Database connection error

- Verify MONGO_URI is correct
- Add Railway/Render IPs to MongoDB whitelist
- Test connection locally first

---

## File Reference

| File                      | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `vercel.json`             | Tells Vercel how to build & deploy frontend |
| `railway.json`            | Tells Railway how to deploy backend         |
| `DEPLOYMENT.md`           | Full deployment guide                       |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist                      |
| `client/.env.production`  | Template for frontend production config     |
| `server/.env.example`     | Template for backend config                 |

---

## Next Steps

1. **Read**: [DEPLOYMENT.md](DEPLOYMENT.md) for complete details
2. **Follow**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) step by step
3. **Deploy**: Push to GitHub and follow the 5 steps above
4. **Test**: Visit your live URL and verify everything works

---

## Need Help?

- **Vercel Issues**: docs.vercel.com
- **Railway Issues**: railway.app/docs
- **MongoDB Issues**: docs.mongodb.com
- **Express/Node Issues**: expressjs.com

---

🎉 **You're all set! Deploy whenever ready.** 🎉
