# Fashion Store with Personalized Recommendations

Full-stack MERN fashion e-commerce app with JWT auth, product variants, personalized recommendations, cart/checkout, PDF invoices, and email notifications.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, PDFKit
- **Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS

## Prerequisites

- Node.js 18+ or 20+
- MongoDB (local or Atlas)
- Mailtrap account (optional, for emails)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fashion-store
JWT_SECRET=your_secret_key_here
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

Seed the database:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

For production frontend, set `frontend/.env`:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full GitHub + Render + Vercel steps.

## Demo Accounts

| Role     | Email                 | Password     |
|----------|-----------------------|--------------|
| Admin    | admin@fashion.com     | admin123     |
| Customer | customer@fashion.com  | customer123  |

## Coupon Codes

- `FASHION10` — 10% off
- `WELCOME20` — 20% off

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products` | List products (`?category=Footwear`) |
| GET | `/api/recommendations` | Personalized picks (auth required) |
| PATCH | `/api/users/track-view` | Track viewed category |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/:id/invoice` | Download PDF invoice |

## Verification Tests

1. **Variants:** Run `npm run seed`, open MongoDB Compass — each product has a `variants` array.
2. **Recommendations:** Login as customer → view Footwear products → `GET /api/recommendations` with Bearer token → Footwear items returned.
3. **PDF Invoice:** Place an order → Order History → Download Invoice.
4. **Email:** Check Mailtrap inbox after register or checkout.

## Deliverables

| Item | Location |
|------|----------|
| Setup & run steps | This README |
| Deployment guide | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| API documentation | [API.md](./API.md) |
| GitHub repo | (https://github.com/vaishragh03/fashion-store-personalized)
| Live frontend | (https://fashion-store-personalized.vercel.app/)
| Live backend | _(https://fashion-store-personalized-ca2a.onrender.com/)
| Demo video | _(https://drive.google.com/file/d/1mdVR6P-iWM69ywFUAKDObgFF3kzkBjJ9/view?usp=sharing)

## Fix product images

If images show alt text only, re-seed the database:

```bash
cd backend
npm run seed
```

Then hard-refresh the browser (Ctrl+Shift+R).

## Features

- Secure JWT authentication with bcrypt passwords
- Admin product catalog (CRUD)
- Dynamic size/color variants with stock
- Personalized recommendations from view & purchase history
- Cart with quantity updates and coupon codes
- Profile and multiple delivery addresses
- Order history with PDF invoice download
- Low-stock inventory alerts for admin
- Transactional emails (welcome, order confirmation)
