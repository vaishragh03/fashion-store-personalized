# Deployment & Git Guide

Step-by-step guide for GitHub upload and live deployment (Render + Vercel recommended — both have free tiers).

---

## Part 1: Fix Images (do this once locally)

Unsplash links often break. Re-seed with reliable image URLs:

```bash
cd backend
npm run seed
```

Refresh the frontend — images should load. If any fail, a colored placeholder appears automatically.

---

## Part 2: Push to GitHub

### 1. Create `.gitignore` at project root (if not present)

Ensure these are **never** committed:
```
node_modules/
.env
backend/.env
frontend/.env
dist/
.DS_Store
```

### 2. Initialize Git and push

```bash
cd fashion-store-personalized

git init
git add .
git commit -m "Fashion store MERN app with personalized recommendations"

# Create empty repo on GitHub (no README) — copy the URL
git remote add origin https://github.com/YOUR_USERNAME/fashion-store-personalized.git
git branch -M main
git push -u origin main
```

**Deliverable:** GitHub Repository Link → `https://github.com/YOUR_USERNAME/fashion-store-personalized`

---

## Part 3: Deploy Backend (Render)

1. Go to [https://render.com](https://render.com) → Sign up → **New Web Service**
2. Connect your GitHub repo
3. Settings:
   | Field | Value |
   |-------|--------|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

4. **Environment Variables** (add in Render dashboard):

   | Key | Value |
   |-----|--------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Same as local `.env` |
   | `PORT` | `5000` (Render sets PORT automatically — use `process.env.PORT` — already in server.js) |
   | `SMTP_HOST` | `sandbox.smtp.mailtrap.io` |
   | `SMTP_PORT` | `2525` |
   | `SMTP_USER` | Your Mailtrap user |
   | `SMTP_PASS` | Your Mailtrap pass |

5. Deploy → copy URL, e.g. `https://fashion-store-api.onrender.com`

6. **Seed production DB once** (from your PC):
   - Temporarily set `MONGO_URI` in local `.env` to same Atlas DB
   - Run `npm run seed` in `backend/`
   - Or use MongoDB Compass to verify products exist

**Deliverable:** Live Backend Link → `https://YOUR-APP.onrender.com`  
Test: open `https://YOUR-APP.onrender.com/` → should show "Fashion Store API Running..."

---

## Part 4: Deploy Frontend (Vercel)

1. Go to [https://vercel.com](https://vercel.com) → Import GitHub repo
2. Settings:
   | Field | Value |
   |-------|--------|
   | Framework Preset | Vite |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

3. **Environment Variable:**

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com/api` |

4. Deploy → get URL e.g. `https://fashion-store.vercel.app`

**Deliverable:** Live Frontend Link → your Vercel URL

---

## Part 5: Enable CORS (if frontend can't reach API)

Your backend already uses `cors()` with default (allows all). For production you can restrict:

```js
app.use(cors({
  origin: ['https://YOUR-FRONTEND.vercel.app', 'http://localhost:5173']
}));
```

Redeploy backend after this change if needed.

---

## Part 6: MongoDB Atlas (if not already)

1. [https://cloud.mongodb.com](https://cloud.mongodb.com) → Cluster → Connect → Drivers
2. Copy connection string → replace password → use as `MONGO_URI`
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) for Render deployment

---

## Part 7: Deliverables Checklist

| Deliverable | What to submit |
|-------------|----------------|
| GitHub Repository | Repo URL |
| Live Frontend | Vercel URL |
| Live Backend/API | Render URL + `/api/products` test |
| README | Root `README.md` (already exists) |
| API Documentation | `API.md` or import to Postman |
| Demo Video | 5–8 min screen recording (see script below) |

---

## Demo Video Script (5–8 minutes)

Record with OBS / Loom / phone. Show:

1. **Home** — category filters, product grid with images
2. **Register / Login** — customer account
3. **Product page** — variant selector (size/color), add to cart
4. **Recommendations** — view Footwear → Home shows "Recommended For You"
5. **Cart** — quantity, coupon `FASHION10`, checkout
6. **Order success** → **Order History** → download PDF invoice
7. **Profile** — edit name, add address
8. **Admin login** — dashboard, low stock, add product
9. (Optional) Mailtrap inbox — welcome + order emails

---

## Alternative Platforms

| Service | Frontend | Backend |
|---------|----------|---------|
| Free | Vercel, Netlify | Render, Railway |
| Paid | AWS Amplify | AWS EC2, Heroku |

Same env vars apply everywhere.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Images not loading | Run `npm run seed` again |
| API 401 on live site | Login again; check `VITE_API_URL` ends with `/api` |
| CORS error | Add Vercel URL to cors origin on backend |
| Render sleeps (free tier) | First request takes ~30s — normal on free plan |
| Emails not sending | Verify SMTP env vars on Render (no spaces after `=`) |

---

## Quick Test After Deploy

```bash
# Replace with your backend URL
curl https://YOUR-BACKEND.onrender.com/api/products
```

Login on live frontend → browse → checkout → download invoice.
