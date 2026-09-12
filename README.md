# 🌱 Cultivate — A Living-Growth Life RPG

> *Reframe your personal productivity as a living garden. Plant seeds, tend your growth, watch yourself bloom.*

[![Live App](https://img.shields.io/badge/Live_Demo-hacktho.vercel.app-2ea44f?style=for-the-badge&logo=vercel)](https://hacktho.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🌐 **Live Web Application:** [https://hacktho.vercel.app](https://hacktho.vercel.app)  
📦 **Repository:** [https://github.com/habeebc84-create/hacktho](https://github.com/habeebc84-create/hacktho)

---

## ✨ What is Cultivate?

Cultivate is a gamified productivity app that maps real-world tasks to a garden metaphor:

| RPG Concept | Cultivate Term |
|---|---|
| Task | Seed |
| Completing a task | Tending / Harvesting |
| XP | Sunlight ☀️ |
| Level | Growth Stage (Seed → Sprout → Bud → Bloom → Tree → Ancient Tree) |
| Attribute | Growth Type (Body, Mind, Craft, Focus) |
| Streak | Season Cycle 🌿 |
| Currency | Nutrients 🌿 |
| Shop | Greenhouse 🏡 |

---

## 🗂️ Project Structure

```
cultivate/
├── client/          # React 18 + Vite + Tailwind + Framer Motion
└── server/          # Node.js + Express + MongoDB (Mongoose)
```

---

## 🚀 Quick Start (Local)

### 1-Click Launch (Windows)
Double-click `run.bat` or run `run.ps1` in PowerShell — it automatically boots the backend, frontend, and launches your browser at `http://localhost:5173`!

### One-Command Runner
```bash
# Install root dependencies
npm install

# Start both backend and frontend concurrently
npm run dev
```

### 2. Configure Environment Variables

**Backend** — copy `server/.env.example` → `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cultivate
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend** — copy `client/.env.example` → `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database (optional shop items)

```bash
cd server
node src/seeds/shopItems.js
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npx vercel --prod
# Set VITE_API_URL to your Render backend URL
```

### Backend → Render
1. Create a new **Web Service** on Render
2. Connect your GitHub repo, set root directory to `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env.example`

---

## 🎮 Features

- **Anti-cheat engine**: All XP/nutrient calculations happen server-side only
- **Season Cycle streaks**: Consecutive daily activity tracked with visual seasons
- **Growth Stages**: 6 stages per growth type with non-linear XP scaling
- **Greenhouse**: Spend nutrients on cosmetic plants, themes, and decorations
- **3D Garden**: CSS perspective + Framer Motion animated garden dashboard
- **Level-up celebration**: Full-screen bloom animation with confetti burst
- **Optimistic UI**: Tasks react instantly, roll back gracefully on errors
- **Accessibility**: Full keyboard nav, ARIA labels, semantic HTML, WCAG AA

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | TanStack Query (React Query), Context API |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (access token + httpOnly refresh cookie) |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored as bcrypt hashes in DB
- All game rewards calculated server-side
- User data strictly scoped by `userId` — no cross-user data access
- Helmet.js for HTTP security headers
- Rate limiting on auth endpoints

---

## 📊 XP Formula

```js
// Sunlight required to advance from stage N → N+1
sunlightRequiredForStage(stage) = Math.round(100 * Math.pow(stage, 1.45))

// Stage thresholds: 100, 172, 252, 339, 432, 529...

// Difficulty rewards
easy   = 15 sunlight + 3 nutrients
medium = 30 sunlight + 7 nutrients
hard   = 60 sunlight + 15 nutrients

// Streak multiplier: +5% per 3-day streak, capped at +50%
multiplier = Math.min(1 + Math.floor(streak/3) * 0.05, 1.5)
```

---

## 📝 License

MIT © 2024 Cultivate
