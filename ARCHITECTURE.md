## GrowAthlete – Architecture and Developer Guide

### Overview
GrowAthlete is a full‑stack JavaScript application with a Node.js/Express backend and a React (Vite) frontend. It uses MongoDB via Mongoose for persistence, issues JWTs stored in an HTTP‑only cookie for auth, and supports file uploads (multer) for the sports resume feature. The frontend also integrates third‑party public sports/news APIs.

### Tech Stack
- **Frontend**: React 19, Vite 7, React Router v6, Tailwind (via `@tailwindcss/vite`), Swiper, Framer Motion, GSAP
- **Backend**: Node.js, Express 5, Mongoose 8, CORS, cookie‑parser, bcryptjs, jsonwebtoken, multer, nodemailer
- **Database**: MongoDB (local) at `mongodb://127.0.0.1:27017/growAthleteDB`
- **Auth**: JWT signed on login/register, stored in HTTP‑only cookie (`token`)
- **Build/Tooling**: Vite dev server with proxy to backend, ESLint
- **3rd‑party APIs (frontend)**:
  - NewsData.io for sports news (requires `VITE_NEWSDATA_API_KEY`)
  - TheSportsDB for live scores

### Monorepo Layout
```text
GrowAthlete/
  backend/
    db.js
    middlewares/
      authMiddleware.js
    models/
      SportsResume.js
      User.js
    routes/
      authRoutes.js
      contactRoute.js
      sportsResume.js
    server.js
    uploads/
      resume.jpg
      resume.webp
    package.json
    package-lock.json

  frontend/
    index.html
    vite.config.js
    eslint.config.js
    package.json
    package-lock.json
    public/
      galogo.png
      vite.svg
    src/
      App.css
      App.jsx
      index.css
      main.jsx
      assets/ ... (images, videos)
      components/ ... (UI components, navbar/footer, error boundary, etc.)
      data/ ... (mock data)
      pages/ ... (route pages)
      pages_css/ ... (page‑scoped styles)
      utils/
        api.js (Axios instance → backend)
        constants.js (static data)
        sportsAPI.js (3rd‑party APIs)
```

### Backend
#### Entry point: `backend/server.js`
- Serves static `uploads/` under `/uploads`
- CORS enabled for `http://localhost:5173` with `credentials: true`
- Parses JSON payloads and cookies
- Connects to MongoDB via `require("./db")`
- Mounts routers:
  - `/api/auth` → `routes/authRoutes.js`
  - `/api/contact` → `routes/contactRoute.js`
  - `/api/sports-resume` → `routes/sportsResume.js`
- Listens on port `5000`

```text
GET/POST flows
  server.js
    ├─ require('./db') → connects MongoDB
    ├─ app.use('/api/auth', authRoutes)
    ├─ app.use('/api/contact', contactRoute)
    └─ app.use('/api/sports-resume', sportsResumeRoutes)
```

#### Database: `backend/db.js`
- Connects to `mongodb://127.0.0.1:27017/growAthleteDB`
- Logs success/failure

#### Models
- `models/User.js`:
  - Fields: `username`, `email` (unique), `password` (hashed), `phone`, `profilePicture`, `role` (enum: athlete/coach/scout/sponsor/admin), `gender`, `sport`, `age`, `location`, `level` (enum), `bio`, `achievements`
- `models/SportsResume.js`:
  - Fields: personal info, sport/position/metrics, `skills` [String], `achievements` [String], `photo` (filename), timestamps via `createdAt`

#### Middleware
- `middlewares/authMiddleware.js`:
  - `verifyToken`: reads JWT from `req.cookies.token`, verifies with secret, assigns `req.user`
  - `isAdmin`: checks `req.user.role === 'admin'`

#### Routes and API Surface
- `routes/authRoutes.js` (base: `/api/auth`)
  - `POST /register` → create user, hash password, issue JWT cookie, returns user info
  - `POST /login` → verify credentials, issue JWT cookie, returns user info
  - `POST /logout` → clears `token` cookie
  - `POST /update` (auth) → update profile fields for current user
  - `GET /all-users` (auth) → list all users excluding passwords
  - `GET /profile` (auth) → current user profile (excludes password)

- `routes/contactRoute.js` (base: `/api/contact`)
  - `POST /` → send email via Nodemailer (Gmail). Note: sender credentials are currently hardcoded and must be moved to environment variables.

- `routes/sportsResume.js` (base: `/api/sports-resume`)
  - Uses `multer` to accept `photo` upload to `uploads/` (served at `/uploads/<file>`)
  - `POST /` → create resume; parses `skills` and `achievements` comma‑separated → arrays
  - `GET /resData` → returns latest resume document
  - `DELETE /resDel` → deletes the latest resume document

#### Auth Flow (Server)
1. On register/login, server signs a JWT `{ id, username, role }` with secret `"yourSecretKey"` and sets it as HTTP‑only cookie `token` (1 day expiry, `sameSite: lax`).
2. Protected routes require `verifyToken` which validates cookie and populates `req.user`.

#### File Uploads
- `multer.diskStorage` saves `photo` as `uploads/resume.<ext>`
- Static files are accessible at `GET http://localhost:5000/uploads/<filename>`

### Frontend
#### Build and Dev Server: `frontend/vite.config.js`
- Plugins: React, Tailwind via `@tailwindcss/vite`
- Dev proxy: requests to `/api` are proxied to `http://localhost:5000`

#### App Bootstrap
- `src/main.jsx` renders `App` into `#root`
- `src/index.html` sets favicon, title, and loads `main.jsx`

#### Routing: `src/App.jsx`
- Uses React Router v6 with routes:
  - `/` → `Home`
  - `/about` → `AboutPage`
  - `/login` → `Login`
  - `/register` → `Register`
  - `/update` → `Profile`
  - `/community` → `CommunityPage`
  - `/sports-resume` → `SportsResume`
  - `/sports-blog` → `SportsBlogPage`, `/sports-blog/:slug` → `SingleBlogPostPage`
  - `/news` → `NewsPage_SportsPulse`
  - `/live-scores` → `LiveScoresPage`
  - `/splash` → `Splash`
  - `/resume-template` → `ResumeTemplate`
  - Protected routes (gated in UI by a simple `localStorage` token check): `/profile`, `/athlete/dashboard`, `/athletes`, `/sports-news`, `/contact`
- Global layout: `Navbar` + `Footer`

Note: The UI gate uses `localStorage.getItem('token')`, while the backend uses an HTTP‑only cookie. Aligning these (e.g., reading auth state via `/api/auth/profile`) is recommended.

#### Client ↔ Server Communication
- `src/utils/api.js` defines an Axios instance:
  - `baseURL: http://localhost:5000/api`
  - `withCredentials: true` (sends/receives cookies for auth)
- Vite dev proxy also allows using relative `/api/...` in fetch/XHR.

Typical flows:
- **Auth**: POST `/api/auth/register` or `/api/auth/login` with credentials → server sets `token` cookie → subsequent requests include cookie due to `withCredentials: true`.
- **Profile**: `GET /api/auth/profile` to derive current user; `POST /api/auth/update` to update profile.
- **Sports Resume**: `POST /api/sports-resume/` with `multipart/form-data` including `photo` and fields; `GET /api/sports-resume/resData` to read latest; `DELETE /api/sports-resume/resDel` to delete latest.
- **Contact**: `POST /api/contact/` with `{ firstName, lastName, email, message }`.

#### Third‑party APIs (frontend only)
- `src/utils/sportsAPI.js` fetches external data:
  - News from NewsData.io via `VITE_NEWSDATA_API_KEY` (preferred) or fallback in `apiConfig.js` (if present)
  - Live scores from TheSportsDB
  - Includes caching, simple rate limiting, exponential backoff, and keyword‑based categorization helpers

### Local Development
#### Prerequisites
- Node.js LTS installed
- MongoDB running locally on `127.0.0.1:27017`

#### Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

#### Start backend
```bash
node server.js
# or add a script in backend/package.json: "start": "node server.js"
```

#### Start frontend
```bash
npm run dev
# Vite runs on http://localhost:5173
```

### Environment and Configuration
- Backend currently hardcodes values and lacks a `.env`. Recommended variables:
  - `MONGODB_URI=mongodb://127.0.0.1:27017/growAthleteDB`
  - `JWT_SECRET=...` (replace `yourSecretKey`)
  - `CORS_ORIGIN=http://localhost:5173`
  - `SMTP_USER=...`, `SMTP_PASS=...` (for Nodemailer Gmail/App Password)
- Frontend:
  - `VITE_NEWSDATA_API_KEY=...` for NewsData.io

### Security and Best Practices (Action Items)
- Move secrets (`JWT` secret, SMTP credentials) from code to environment variables.
- Replace `secure: false` with `secure: true` for cookies in production and ensure HTTPS.
- Validate and sanitize inputs for all API endpoints.
- Consider using `helmet` and rate limiting on the server.
- Unify auth state on frontend: derive logged‑in state from `/api/auth/profile` instead of `localStorage`.

### Notable Directories
- `backend/uploads/`: persisted uploaded images (served via `/uploads/...`). Ensure this path is writable and excluded from version control if needed.
- `frontend/assets/`, `frontend/public/`: static assets used by the UI.

### Quick API Reference
```http
POST   /api/auth/register            body: { username, email, password, role? }
POST   /api/auth/login               body: { email, password }
POST   /api/auth/logout
POST   /api/auth/update              auth cookie; body: profile fields
GET    /api/auth/all-users           auth cookie
GET    /api/auth/profile             auth cookie

POST   /api/contact/                 body: { firstName, lastName, email, message }

POST   /api/sports-resume/           multipart/form-data (photo + fields)
GET    /api/sports-resume/resData
DELETE /api/sports-resume/resDel
```

### Known Gaps / Future Improvements
- Add backend scripts (`start`, `dev` with nodemon) and proper `.env` handling.
- Expand validation/schema constraints for resume and user updates.
- Add tests and CI.
- Implement role‑based UI and server authorization beyond basic checks.
- Centralize error handling and logging.

---
This document reflects the current repository state and should be updated alongside code changes.


