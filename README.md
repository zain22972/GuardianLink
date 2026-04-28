# 🛡️ GuardianLink — Tactical Disaster Response Suite

> An AI-powered full-stack platform for coordinating disaster relief operations — built with React, FastAPI, Supabase, and Google Gemini.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the App](#running-the-app)
- [Modules & Pages](#modules--pages)
- [API Endpoints](#api-endpoints)

---

## Overview

GuardianLink connects field volunteers, admin coordinators, and AI systems into a unified tactical dashboard. Key capabilities include:

- 🧠 **EVA AI Assistant** — Gemini-powered chatbot for field guidance
- 📷 **OCR Need Extraction** — Upload disaster images and auto-extract structured data via Gemini Vision
- 🔗 **Volunteer Matcher** — Match volunteers to active missions in real time
- 📡 **Mission Dispatch** — Admin tools to create, track, and resolve missions
- 📦 **Inventory & Requests** — Manage relief supply requests
- 📁 **Directory** — Searchable volunteer and responder database

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4 |
| Routing | React Router DOM v7 |
| Animations | Framer Motion |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (`gemini-flash-latest`) |
| Auth | Supabase Auth |

---

## Project Structure

```
GuardianLink/
├── backend/
│   ├── main.py              # FastAPI app — EVA chat, OCR extract, health check
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Backend secrets (NOT committed)
├── src/
│   ├── lib/
│   │   └── supabase.ts      # Supabase client initialization
│   ├── pages/
│   │   ├── Landing.tsx      # Entry point for new users
│   │   ├── Login.tsx        # Secure Command Bridge (admin login)
│   │   ├── Dashboard.tsx    # Admin command center
│   │   ├── Matcher.tsx      # Volunteer-to-mission matcher
│   │   ├── AdminMissions.tsx# Admin mission management
│   │   ├── Missions.tsx     # Field responder mission view
│   │   ├── Requests.tsx     # Supply request management
│   │   ├── Directory.tsx    # Volunteer directory
│   │   ├── Inventory.tsx    # Inventory tracker
│   │   ├── Broadcast.tsx    # Emergency broadcast system
│   │   ├── VolunteerChat.tsx# EVA AI chat interface
│   │   ├── VolunteerMissions.tsx # Volunteer mission tracker
│   │   └── VolunteerOCR.tsx # Image OCR upload tool
│   ├── components/          # Shared UI components
│   ├── App.tsx              # Routes definition
│   └── index.css            # Global styles
├── .env                     # Frontend secrets (NOT committed)
├── .gitignore               # Excludes .env, .venv, node_modules
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Prerequisites

Make sure these are installed before you begin:

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Python** 3.11+ → [python.org](https://python.org)
- **Git** → [git-scm.com](https://git-scm.com)
- A **Supabase** project → [supabase.com](https://supabase.com)
- A **Google Gemini** API key → [aistudio.google.com](https://aistudio.google.com)

---

## Environment Setup

### 1. Clone the repo

```bash
git clone https://github.com/zain22972/GuardianLink.git
cd GuardianLink
```

### 2. Create the Frontend `.env` file

Create a file named `.env` in the **root** of the project:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8003
```

> 🔑 **Where to find these:**
> - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` → Supabase Dashboard → Project Settings → API
> - `VITE_BACKEND_URL` → The address where your FastAPI backend is running. Change the IP to your machine's local IP if accessing from mobile.

### 3. Create the Backend `.env` file

Create a file named `.env` inside the **`backend/`** folder:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🔑 **Where to find these:**
> - `SUPABASE_SERVICE_KEY` → Supabase Dashboard → Project Settings → API → `service_role` key (keep this secret!)
> - `GEMINI_API_KEY` → [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Frontend Setup

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

> For mobile access on the same Wi-Fi network, run `npm run dev -- --host` and use your machine's local IP (e.g., `http://192.168.x.x:5173`).

---

## Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate it
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The backend API will be available at: **`http://localhost:8003`**

You can verify it's working by visiting: **`http://localhost:8003/health`**

---

## Running the App

You need **two terminals** running simultaneously:

| Terminal | Command | What it does |
|---|---|---|
| Terminal 1 (root) | `npm run dev` | Starts the React frontend |
| Terminal 2 (backend/) | `python main.py` | Starts the FastAPI backend |

Open your browser at `http://localhost:5173` to access the app.

---

## 🚀 Deployment

### 1. Backend — [Render.com](https://render.com)
1. **New Web Service**: Connect your GitHub repo.
2. **Root Directory**: Set to `backend`.
3. **Build Command**: `pip install -r requirements.txt`.
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. **Environment Variables**: Add `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and `GEMINI_API_KEY`.

### 2. Frontend — [Vercel.com](https://vercel.com)
1. **Import Project**: Connect your GitHub repo.
2. **Framework Preset**: Select **Vite**.
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**: Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_BACKEND_URL` (use your Render URL here).

---

## Modules & Pages

| Page | Route | Who uses it |
|---|---|---|
| Landing | `/` | Everyone — entry point |
| Login | `/login` | Admins — secure access |
| Dashboard | `/dashboard` | Admins — command center |
| Matcher | `/matcher` | Admins — match volunteers to missions |
| Admin Missions | `/admin-missions` | Admins — create & manage missions |
| Requests | `/requests` | Admins — supply request management |
| Directory | `/directory` | Admins — volunteer search |
| Inventory | `/inventory` | Admins — supply tracking |
| Broadcast | `/broadcast` | Admins — emergency alerts |
| Volunteer Chat | `/volunteer-chat` | Volunteers — chat with EVA AI |
| Volunteer Missions | `/volunteer-missions` | Volunteers — view assigned missions |
| Volunteer OCR | `/volunteer-ocr` | Volunteers — upload disaster report images |

---

## API Endpoints

The backend runs on port `8003` and exposes:

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/health` | Checks Supabase & Gemini connectivity |
| `POST` | `/chat` | Chat with EVA AI assistant |
| `POST` | `/extract` | Extract structured disaster data from an image URL via Gemini Vision |

### Example: Chat with EVA
```bash
curl -X POST http://localhost:8003/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What supplies are needed for flood response?"}'
```

### Example: Extract from Image
```bash
curl -X POST http://localhost:8003/extract \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/disaster-report.jpg"}'
```

---

## Common Issues

| Problem | Fix |
|---|---|
| `VITE_SUPABASE_URL` not found | Make sure `.env` is in the root folder, not inside `src/` |
| Backend `404` on Gemini | Verify your `GEMINI_API_KEY` is valid at [aistudio.google.com](https://aistudio.google.com) |
| CORS errors from frontend | Ensure `VITE_BACKEND_URL` in `.env` exactly matches the backend address |
| Mobile can't reach backend | Use your PC's local IP (not `localhost`) in `VITE_BACKEND_URL` and run `python main.py` with `host="0.0.0.0"` |
| Supabase RLS blocking inserts | The backend uses the `service_role` key which bypasses RLS — verify `SUPABASE_SERVICE_KEY` is correct |

---

*Built for GuardianLink Tactical Suite — Disaster Response Platform*
