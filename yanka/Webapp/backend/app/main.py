from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
from typing import Optional
import os

import httpx

from .auth import verify_cognito_token
from .routers import users, progress

load_dotenv()

app = FastAPI(
    title="YANKA API",
    description="Backend API for YANKA",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HeyGen Route
HEYGEN_VIDEO_API_URL = "https://api.heygen.com/v2/video/generate"
DEFAULT_HEYGEN_AVATAR_ID = "Maria_public_2_20240111"
DEFAULT_HEYGEN_VOICE_ID = "6c417ccc9d63481ab08699c325d7dccd"

app.include_router(users.router)
app.include_router(progress.router)

#### Routes ####
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "YANKA API", "docs": "/docs"}


class ChatRequest(BaseModel):
    message: str


SYSTEM_PROMPT = """You are YANKA's support assistant. Only answer questions related to YANKA's features,
pricing, and account issues. If asked anything unrelated, politely decline and redirect the user. Be concise,
polite, and brief in your answers.

## About YANKA
YANKA is an all-in-one intelligent platform designed to revolutionize how the world learns, teaches,
researches, and creates. Built with cutting-edge AI, YANKA combines voice-enabled tutoring, AI avatar
video creation, academic research tools, professional training development, and a fully integrated
knowledge marketplace.

## Features
Platform | AI Video Generation | Real-Time AI Avatars | AI Training Programs
Wide Range of Courses | AI Data Analysis & Visualization | Thesis & Dissertation Builder

## Pricing (4 Plans)
- Learn (Free): AI chatbot access; Unlimited AI video creation; Study planner & progress tracker; Limited daily questions; Community Q&A
- Plus ($9.99/month): Unlimited AI tutor sessions; AI essay & assignment assistant; Research & Thesis Builder; AI avatars & video creation; Advanced study analytics
- Scholar ($24.99/month): All Plus features; Full Academic & Research Suite; Collaboration tools; Priority support; Document cloud backup
- Institution (from $2,499/month): Full academic + learning ecosystem; Custom branding; API & LMS integration; Institutional analytics; Admin control & compliance

## Support
If a user wants to talk to a human, tell them to call "123-456-7890".
"""


@app.post("/chat")
def chat(
    request: ChatRequest,
    claims: dict = Depends(verify_cognito_token),  # auth enforced here
):
    """
    Protected chat endpoint. Requires a valid Cognito ID token in the
    Authorization: Bearer <token> header.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request.message},
        ],
    )

    return {
        "response": completion.choices[0].message.content}

def generate_video_script_with_openai(
    lesson_content: str,
    language: str,
    video_type: str,
    custom_video_type: str = "",
) -> str:
    """
    Uses OpenAI to turn lesson content into a short, clear video narration script.
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    video_format = custom_video_type if video_type == "custom" and custom_video_type else video_type

    prompt = f"""
You are helping create an educational AI video lesson.

Task:
Turn the lesson content below into a clear, engaging narration script for a short educational video.

Requirements:
- Write in {language}
- Video type: {video_format or 'general lesson'}
- Keep it concise and natural for spoken narration
- Make it easy for learners to understand
- Organize it like a short teaching script
- Do not include stage directions, markdown, or bullet points unless necessary
- Keep the tone educational, friendly, and clear

Lesson content:
{lesson_content}
"""

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You create educational video narration scripts."},
            {"role": "user", "content": prompt},
        ],
    )

    return completion.choices[0].message.content or ""

@app.post("/video/generate")
async def generate_video(
    title: str = Form(...),
    avatar: str = Form(""),
    language: str = Form("english"),
    subtitle: str = Form("none"),
    video_type: str = Form(""),
    custom_video_type: str = Form(""),
    script: str = Form(""),
    template_style: str = Form("presentation"),
    content_mode: str = Form("slides_avatar"),
    lesson_visual_notes: str = Form(""),
    file: Optional[UploadFile] = File(None),
):
    """
    Generate a script with OpenAI, then send it to HeyGen to create a video.
    """

    if not title.strip():
        raise HTTPException(status_code=400, detail="Video title is required.")

    if not script.strip() and file is None:
        raise HTTPException(
            status_code=400,
            detail="Please provide a script or upload a lesson file.",
        )

    lesson_content = script.strip()

    if not lesson_content and file is not None:
        lesson_content = f"Uploaded file received: {file.filename}"

    enhanced_prompt = f"""
    You are creating an educational AI video script AND visual plan.

    Video Style:
    - Language: {language}
    - Video type: {custom_video_type if video_type == "custom" and custom_video_type else (video_type or "general lesson")}
    - Template: {template_style}
    - Layout: {content_mode}

    Instructions:
    - Break the lesson into short sections
    - Format every section exactly like:
    Section 1:
    Narration: ...
    Visual: ...
    - For each section, provide:
    1. Narration: what the avatar says
    2. Visual: what should appear on screen
    - Keep narration natural, concise, and easy to speak aloud

    User Notes:
    {lesson_visual_notes or "None"}

    Lesson Content:
    {lesson_content}
    """

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You create structured educational video scripts."},
            {"role": "user", "content": enhanced_prompt},
        ],
    )

    generated_script = completion.choices[0].message.content or ""
    spoken_lines = []

    for line in generated_script.split("\n"):
        stripped = line.strip()
        if "narration:" in stripped.lower():
            spoken_lines.append(stripped.split(":", 1)[1].strip())

    spoken_script = " ".join(spoken_lines).strip()

    bad_phrases = ["video title", "end screen", "section", "visual"]

    for phrase in bad_phrases:
        spoken_script = spoken_script.replace(phrase, "")

    if not spoken_script:
        spoken_script = generated_script.strip()
    
    print("GENERATED SCRIPT:", generated_script)
    print("SPOKEN SCRIPT:", spoken_script)

    heygen_api_key = os.getenv("HEYGEN_API_KEY")
    if not heygen_api_key:
        raise HTTPException(status_code=500, detail="HEYGEN_API_KEY not found.")

    selected_avatar_id = DEFAULT_HEYGEN_AVATAR_ID

    headers = {
        "X-Api-Key": heygen_api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": selected_avatar_id,
                    "avatar_style": "normal",
                },
                "voice": {
                    "type": "text",
                    "input_text": spoken_script,
                    "voice_id": DEFAULT_HEYGEN_VOICE_ID,
                }
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            HEYGEN_VIDEO_API_URL,
            headers=headers,
            json=payload,
            timeout=60.0,
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    heygen_data = response.json()
    video_id = heygen_data.get("data", {}).get("video_id")

    if not video_id:
        raise HTTPException(status_code=500, detail="HeyGen did not return a video_id.")

    return {
        "success": True,
        "message": "Video request sent to HeyGen successfully.",
        "video_id": video_id,
        "status": "processing",
        "generated_script": generated_script,
        "data": {
            "title": title,
            "avatar": selected_avatar_id,
            "language": language,
            "subtitle": subtitle,
            "video_type": video_type,
            "custom_video_type": custom_video_type,
            "template_style": template_style,
            "content_mode": content_mode,
            "lesson_visual_notes": lesson_visual_notes,
            "script_provided": bool(script.strip()),
            "uploaded_filename": file.filename if file else None,
        },
        "heygen_response": heygen_data,
    }

@app.get("/video/avatars")
async def get_heygen_avatars():
    api_key = os.getenv("HEYGEN_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="HEYGEN_API_KEY not found.")

    headers = {
        "X-Api-Key": api_key,
        "Accept": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.heygen.com/v2/avatars",
            headers=headers,
            timeout=30.0,
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


@app.get("/video/voices")
async def get_heygen_voices():
    api_key = os.getenv("HEYGEN_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="HEYGEN_API_KEY not found.")

    headers = {
        "X-Api-Key": api_key,
        "Accept": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.heygen.com/v2/voices",
            headers=headers,
            timeout=30.0,
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()

@app.get("/video/status/{video_id}")
async def get_video_status(video_id: str):
    api_key = os.getenv("HEYGEN_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="HEYGEN_API_KEY not found.")

    headers = {
        "X-Api-Key": api_key,
        "Accept": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.heygen.com/v1/video_status.get?video_id={video_id}",
            headers=headers,
            timeout=30.0,
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()