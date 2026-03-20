# 🚀 Deploying StayFinder to Vercel & Railway/Render

## Part 1: Deploy Frontend to Vercel

### Prerequisites

- GitHub account (push your code there first)
- Vercel account (vercel.com)

### Steps

1. **Push to GitHub** (if not already done)

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/stayfinder.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Paste your GitHub repo URL
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `stayfinder-client` (or your choice)
   - **Framework Preset**: React
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && npm install --prefix client`

4. **Add Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`
     - (You'll need your backend URL first - see Part 2)
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend URL will be displayed

---

## Part 2: Deploy Backend to Railway or Render

### Option A: Railway.app (Recommended - Easier)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "GitHub Repo"
   - Connect your stayfinder repo
   - Select "Deploy now"

3. **Configure Environment Variables**
   - In Railway Dashboard, go to your project
   - Click "Variables" tab
   - Add all environment variables from `server/.env.example`:
     ```
     PORT=5000
     NODE_ENV=production
     MONGO_URI=<your_production_mongodb>
     JWT_SECRET=<generate_strong_secret>
     CLOUDINARY_CLOUD_NAME=<your_value>
     CLOUDINARY_API_KEY=<your_value>
     CLOUDINARY_API_SECRET=<your_value>
     FRONTEND_URL=https://your-vercel-domain.vercel.app
     STRIPE_SECRET_KEY=<if_using>
     ```

4. **Set Startup Command**
   - Go to "Deployments" → "Build" settings
   - Set **Start Command**: `npm install --prefix server && npm start --prefix server`

5. **Get Backend URL**
   - In Railway, go to "Networking" section
   - Copy your public domain (looks like: `https://your-app-xxxx.railway.app`)
   - Update Vercel environment variable `REACT_APP_API_URL` with `https://your-app-xxxx.railway.app/api`

### Option B: Render.com (Alternative)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `stayfinder` repo

3. **Configure**
   - **Name**: `stayfinder-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free or Paid

4. **Add Environment Variables**
   - In Render Dashboard, go to Environment section
   - Add all variables from `server/.env.example`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy the service URL

---

## Part 3: Verify Deployment

1. **Update Frontend API URL** (if not done already)
   - Vercel Dashboard → Environment Variables
   - Set `REACT_APP_API_URL` to your Railway/Render backend URL + `/api`
   - Redeploy frontend

2. **Test Connection**
   - Visit your Vercel frontend URL
   - Open browser DevTools → Console
   - Try login/register to test API connection

3. **Troubleshooting**
   - **CORS Errors**: Make sure `FRONTEND_URL` in backend matches Vercel domain
   - **API Not Found**: Verify `REACT_APP_API_URL` is correctly set in Vercel
   - **Database Issues**: Check MONGO_URI is correct and accessible from Railway/Render

---

## MongoDB Setup (if needed)

If you don't have a production MongoDB:

**Option 1: MongoDB Atlas (Cloud)**

- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create free cluster
- Get connection string
- Add to Railway/Render environment: `MONGO_URI=<connection_string>`

**Option 2: Use Provided Backup**

- Restore from `backup/stayfinder/` using MongoDB Compass or mongorestore command

---

## Useful Commands for Local Testing

```bash
# Test build
npm run build --prefix client

# Test start backend
npm start --prefix server

# Concurrent dev
npm run dev
```

---

## Summary of Deployment Strategy

```
┌─────────────────┐
│ GitHub Repo     │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
    ▼           ▼
┌─────────┐  ┌──────────┐
│ Vercel  │  │ Railway  │
│(Frontend)│  │(Backend) │
└─────────┘  └──────────┘
    │           │
    └─────┬─────┘
          ▼
    [Live App Works]
```
