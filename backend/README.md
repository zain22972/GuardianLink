# GuardianLink Backend

Python FastAPI backend for GuardianLink disaster coordination platform. This service provides AI-powered extraction of disaster reports from images using Google Gemini Vision.

## Features

- **POST /extract**: Receives an image URL, extracts structured disaster data (category, priority, location, etc.) using Gemini, and saves the result to the Supabase `needs` table.
- **GET /health**: Verifies connectivity to both Supabase and the Gemini API.
- **CORS Enabled**: Configured for cross-origin requests from the React frontend.
- **Service Role Integration**: Uses Supabase `service_role` key to bypass RLS for administrative record insertion.

## Tech Stack

- **FastAPI**: Modern, fast web framework for Python.
- **Google Gemini Vision**: Multimodal AI for structured data extraction from images.
- **Supabase (PostgreSQL)**: Backend database and storage.
- **Pydantic**: Data validation and settings management.

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Google Gemini API Key
- Supabase Project with `service_role` key

### 2. Local Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # Linux/macOS
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and `GEMINI_API_KEY`.

### 3. Running the Server
```bash
python main.py
```
The server will start at `http://localhost:8002`.

## Deployment (Railway)

This backend is ready for deployment on [Railway](https://railway.app/).
- The `Procfile` is included for zero-config startup.
- Ensure you set the environment variables in the Railway dashboard.

## API Documentation

Once running, visit `http://localhost:8002/docs` for the interactive Swagger UI.
