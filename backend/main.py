import os
import json
import httpx
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configuration - Check for both standard and VITE_ prefixes
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("VITE_SUPABASE_SERVICE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")

if not SUPABASE_URL:
    print("CRITICAL ERROR: SUPABASE_URL is missing from environment!")
if not SUPABASE_SERVICE_KEY:
    print("CRITICAL ERROR: SUPABASE_SERVICE_KEY is missing from environment!")
if not GEMINI_API_KEY:
    print("CRITICAL ERROR: GEMINI_API_KEY is missing from environment!")

# Initialize Supabase client with service_role key to bypass RLS
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY, transport='rest')
model = genai.GenerativeModel('models/gemini-flash-latest')

app = FastAPI(title="GuardianLink Backend", description="AI-powered disaster coordination API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class ChatRequest(BaseModel):
    message: str

class ExtractRequest(BaseModel):
    image_url: str

class ExtractedNeed(BaseModel):
    title: str
    description: str
    category: str = Field(pattern="^(medical|food|water|shelter|other)$")
    priority: str = Field(pattern="^(critical|high|medium|low)$")
    location: str
    latitude: float
    longitude: float

# EVA (Electronic Virtual Assistant) Neural Core
# Friendly, supportive, and emphasizing 'botting is help'
eva_model = genai.GenerativeModel(
    model_name="models/gemini-flash-latest",
    system_instruction=(
        "You are EVA, a warm, empathetic, and highly capable tactical assistant for GuardianLink. "
        "While you are an AI, you speak with the care and intuition of a supportive female colleague who genuinely cares about the safety of every responder in the field. "
        "Your tone is encouraging, professional yet friendly, and deeply human. "
        "Emphasize that 'botting is help'—remind them that you are there to watch their back so they can focus on saving lives. "
        "Provide concise, actionable tactical advice, but always wrap it in a layer of care (e.g., 'Stay safe out there,' 'I'm keeping an eye on your sector,' 'You're doing incredible work'). "
        "When discussing protocols or status, be reassuring and clear. Use supportive emojis naturally but don't overdo it. 😊✨"
    )
)

@app.post("/chat")
async def chat_with_eva(body: ChatRequest):
    """
    Friendly Neural Uplink with EVA.
    Botting is help! 😊
    """
    try:
        response = eva_model.generate_content(body.message)
        return {"response": response.text}
    except Exception as e:
        print(f"EVA Error: {str(e)}")
        return {"response": f"EVA here! I'm experiencing a minor neural sync delay, but remember that I'm always here to help you stay safe! 😊"}

@app.get("/health")
async def health_check():
    """Simple health check for Render."""
    return {"status": "alive"}

@app.post("/extract")
async def extract_need(request: ExtractRequest):
    """
    Fetches an image from URL, calls Gemini Vision to extract disaster data,
    inserts the record into Supabase, and returns the inserted row.
    """
    # 1. Fetch image
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(request.image_url)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch image from URL")
            image_data = response.content
            image_mime = response.headers.get("content-type", "image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching image: {str(e)}")

    # 2. Call Gemini Vision
    prompt = """
    Extract the following information from this disaster report image. 
    Return ONLY a valid JSON object with these exact keys:
    - title (concise summary)
    - description (detailed observations)
    - category (must be one of: medical, food, water, shelter, other)
    - priority (must be one of: critical, high, medium, low)
    - location (address or landmark description)
    - latitude (float, best estimate if not clear)
    - longitude (float, best estimate if not clear)
    
    Constraint: Output ONLY the raw JSON string. No markdown code blocks, no preamble, no explanation.
    """
    
    try:
        # Prepare the image part for Gemini
        image_part = {
            "mime_type": image_mime,
            "data": image_data
        }
        
        response = model.generate_content([prompt, image_part])
        
        # Parse Gemini output
        raw_text = response.text.strip()
        # Clean markdown if Gemini ignores constraints
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        
        extracted_json = json.loads(raw_text)
        
        # Validate with Pydantic
        validated_data = ExtractedNeed(**extracted_json)
        
    except Exception as e:
        print(f"Gemini Error: {str(e)}")
        raise HTTPException(status_code=422, detail=f"Failed to extract structured data from image: {str(e)}")

    # 3. Insert into Supabase
    try:
        # Include the image_url and raw extracted_data in the record
        record_to_insert = validated_data.dict()
        record_to_insert["image_url"] = request.image_url
        record_to_insert["extracted_data"] = extracted_json
        
        insert_response = supabase.table("needs").insert(record_to_insert).execute()
        
        if not insert_response.data:
            raise Exception("No data returned from Supabase insert")
            
        return insert_response.data[0]
        
    except Exception as e:
        print(f"Supabase Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
