# ✅ Deployment Checklist for StayFinder

## Before Deployment

### Code Preparation

- [ ] Push latest code to GitHub (create public repo if needed)
- [ ] Verify no `.env` files are committed (check `.gitignore`)
- [ ] Test build locally: `npm run build --prefix client`
- [ ] Verify server starts in production mode

### Environment Setup

- [ ] Get MongoDB Atlas URI (or prepare restore from backup)
- [ ] Generate secure JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Have Cloudinary credentials ready (optional, for image uploads)
- [ ] Have Stripe keys ready (optional, if using payments)

---

## Frontend Deployment (Vercel)

### Initial Setup

- [ ] Create Vercel account (vercel.com)
- [ ] Connect GitHub repo to Vercel
- [ ] Select project root (use default)

### Configuration

- [ ] Set Build Command: `npm run build --prefix client`
- [ ] Set Output Directory: `client/build`
- [ ] Set Install Command: `npm install && npm install --prefix client`

### Environment Variables (add after backend is ready)

- [ ] Add `REACT_APP_API_URL` = `https://your-railway-domain/api`

### Deployment

- [ ] Click "Deploy"
- [ ] Wait for build to succeed
- [ ] Test frontend loads at provided URL
- [ ] Note your Vercel domain: `https://xxxx.vercel.app`

---

## Backend Deployment (Railway or Render)

### Choose Platform

- [ ] **Railway** (easier): Go to railway.app, sign with GitHub
- [ ] **Render** (alternative): Go to render.com, sign with GitHub

### Railway Steps

- [ ] Create new project → GitHub Repo
- [ ] Select stayfinder repo
- [ ] Add environment variables (see values below)
- [ ] Set Start Command: `npm install --prefix server && npm start --prefix server`
- [ ] Deploy automatically
- [ ] Note your Railway domain from Networking tab

### Render Steps

- [ ] Create new Web Service
- [ ] Connect GitHub repo
- [ ] Set Build Command: `npm install --prefix server`
- [ ] Set Start Command: `node server/server.js`
- [ ] Add environment variables (see values below)
- [ ] Deploy
- [ ] Note your Render domain from service page

### Environment Variables to Add

```
PORT=5000
NODE_ENV=production
MONGO_URI=<mongodb_atlas_uri>
JWT_SECRET=<generated_secret>
CLOUDINARY_CLOUD_NAME=<your_value>
CLOUDINARY_API_KEY=<your_value>
CLOUDINARY_API_SECRET=<your_value>
FRONTEND_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=<if_using>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Post-Deployment Verification

### Backend Testing

- [ ] Verify backend URL works: `curl https://your-backend/api`
- [ ] Check logs in Railway/Render dashboard
- [ ] Look for any error messages

### Frontend Testing

- [ ] Visit Vercel URL
- [ ] Open DevTools Console (check for errors)
- [ ] Try creating an account
- [ ] Try logging in
- [ ] Check Network tab - API calls should go to your backend domain

### Common Issues & Fixes

| Issue          | Fix                                                     |
| -------------- | ------------------------------------------------------- |
| CORS Error     | Update `FRONTEND_URL` in backend to match Vercel domain |
| API 404        | Check `REACT_APP_API_URL` is correct in Vercel settings |
| Blank Page     | Check browser console for JavaScript errors             |
| Database Error | Verify MONGO_URI is accessible from Railway/Render IPs  |
| Auth Failing   | Ensure JWT_SECRET is set and same on backend            |

---

## Getting URLs for CORS

### Your Vercel Frontend URL:

**Example**: `https://stayfinder-client.vercel.app`

- Found in Vercel Dashboard → Deployments → Visit

### Your Railway/Render Backend URL:

**Railway**: Dashboard → Networking → Public URL  
**Render**: Dashboard → Service → Environment  
**Format**: `https://xxxxx.railway.app` or `https://xxxxx.onrender.com`

### Final Step

1. Copy backend URL
2. Go to Vercel → Settings → Environment Variables
3. Update `REACT_APP_API_URL` = `<backend_url>/api`
4. Redeploy frontend (Vercel auto-redeploys on variable change)

---

## Database Seeding (Optional)

If you want to restore the demo data:

**Using MongoDB Compass:**

1. Connect with your MONGO_URI
2. Create database `stayfinder`
3. Import BSON files from `backup/stayfinder/`

**Using mongorestore:**

```bash
mongorestore --uri "your_mongo_uri" backup/stayfinder/
```

---

## Monitoring & Maintenance

- [ ] Set up email alerts in Railway/Render
- [ ] Monitor error logs regularly
- [ ] Keep dependencies updated
- [ ] Rotate JWT_SECRET periodically
- [ ] Monitor database storage usage

---

## Support & Contacts

- **Vercel Help**: docs.vercel.com
- **Railway Help**: railway.app/docs
- **Render Help**: render.com/docs
- **MongoDB Help**: docs.mongodb.com
