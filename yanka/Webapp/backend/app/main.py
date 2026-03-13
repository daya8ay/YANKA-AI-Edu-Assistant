import asyncio
import os
import re
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from io import BytesIO
from pypdf import PdfReader
from docx import Document

from .auth import verify_cognito_token, get_current_user
from .routers import users, progress, avatars, videos
from .routers.videos import _upload_bytes_to_s3, _generate_presigned_url
from .models import User, GeneratedVideo, SourceContent, AIAvatar
from .schemas import (
    SourceContentCreate, SourceContentResponse,
    GeneratedVideoResponse, GeneratedVideoWithDetails,
    VideoGenerateRequest, HeyGenAvatarData, UserAvatarCreate,
    AvatarNameUpdate, FileUploadResponse
)
from .database import get_db
from sqlalchemy.orm import Session, joinedload
import json
from model.model import predict as model_predict

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
DEFAULT_HEYGEN_AVATAR_ID = "Vemon_sitting_office_front"
DEFAULT_HEYGEN_VOICE_ID = "cc5fb6c924064712ba9f690852aa4646"

app.include_router(users.router)
app.include_router(progress.router)
app.include_router(avatars.router)
app.include_router(videos.router)

#### Routes ####
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "YANKA API", "docs": "/docs"}

class VideoMetrics(BaseModel):
    video_duration: float
    time_watched: float
    skip_count: int
    pause_count: int


@app.post("/api/video-analytics/predict")
def video_analytics_predict(metrics: VideoMetrics):
    """Run ML model on video metrics and return prediction."""
    try:
        prediction = model_predict(metrics.model_dump())
        return {"ok": True, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

    return {"response": completion.choices[0].message.content}


HEYGEN_BASE_URL = "https://api.heygen.com"


def _get_heygen_api_key() -> str:
    key = os.getenv("HEYGEN_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="Missing HEYGEN_API_KEY on the backend environment.",
        )
    return key


def _heygen_get_json(path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    api_key = _get_heygen_api_key()
    url = f"{HEYGEN_BASE_URL}{path}"
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.get(url, headers={"x-api-key": api_key}, params=params)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as e:
        # Avoid leaking sensitive details; surface a safe message.
        raise HTTPException(status_code=502, detail=f"HeyGen request failed: {e.response.status_code}")


def _ingest_v2_avatars_page(
    data: Dict[str, Any],
    avatars_by_id: Dict[str, Any],
    tp_by_id: Dict[str, Any],
) -> int:
    """Merge one /v2/avatars response page into maps. Returns count of newly seen ids."""
    before = len(avatars_by_id) + len(tp_by_id)
    for a in data.get("avatars") or []:
        aid = a.get("avatar_id")
        if aid:
            avatars_by_id[aid] = a
    for tp in data.get("talking_photos") or []:
        tid = tp.get("talking_photo_id")
        if tid:
            tp_by_id[tid] = tp
    return len(avatars_by_id) + len(tp_by_id) - before


async def _heygen_fetch_v2_avatars_all_pages(client: httpx.AsyncClient) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Pull studio avatars + talking photos. First request is unpaginated (HeyGen default).
    If the API honors offset/limit, follow pages until no new ids appear.
    """
    avatars_by_id: Dict[str, Any] = {}
    tp_by_id: Dict[str, Any] = {}

    main = await client.get("/v2/avatars")
    main.raise_for_status()
    _ingest_v2_avatars_page(main.json().get("data") or {}, avatars_by_id, tp_by_id)

    limit = 500
    offset = limit
    for _ in range(400):
        try:
            r = await client.get("/v2/avatars", params={"offset": offset, "limit": limit})
            if r.status_code >= 400:
                break
            r.raise_for_status()
        except (httpx.HTTPStatusError, httpx.RequestError):
            break
        new = _ingest_v2_avatars_page(r.json().get("data") or {}, avatars_by_id, tp_by_id)
        if new == 0:
            break
        batch = (r.json().get("data") or {}).get("avatars") or []
        batch_tp = (r.json().get("data") or {}).get("talking_photos") or []
        if len(batch) + len(batch_tp) < limit:
            break
        offset += limit

    return list(avatars_by_id.values()), list(tp_by_id.values())


def _avatar_group_looks_to_rows(
    looks_by_id: Dict[str, Any],
    group_id: str,
    group_name: str,
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for lid, look in looks_by_id.items():
        preview = look.get("image_url") or look.get("motion_preview_url") or ""
        look_name = (look.get("name") or str(lid)).strip()
        gname = (group_name or "").strip()
        display_name = f"{gname} · {look_name}" if gname else look_name
        out.append(
            {
                "id": lid,
                "name": display_name,
                "gender": look.get("gender"),
                "preview_image_url": preview,
                "default_voice_id": look.get("default_voice_id"),
                "kind": "avatar_group",
                "group_id": group_id,
                "look_status": look.get("status"),
            }
        )
    return out


async def _heygen_fetch_group_looks(
    client: httpx.AsyncClient,
    sem: asyncio.Semaphore,
    group_id: str,
    group_name: str,
) -> List[Dict[str, Any]]:
    """All looks in one avatar group (every status). Paginates when HeyGen honors offset/limit."""
    looks_by_id: Dict[str, Any] = {}
    limit = 200
    offset = 0

    while offset < 100_000:
        async with sem:
            try:
                resp = await client.get(
                    f"/v2/avatar_group/{group_id}/avatars",
                    params={"offset": offset, "limit": limit},
                )
                if offset == 0 and resp.status_code >= 400:
                    resp = await client.get(f"/v2/avatar_group/{group_id}/avatars")
                resp.raise_for_status()
            except (httpx.HTTPStatusError, httpx.RequestError):
                if offset == 0:
                    try:
                        resp = await client.get(f"/v2/avatar_group/{group_id}/avatars")
                        resp.raise_for_status()
                    except (httpx.HTTPStatusError, httpx.RequestError):
                        return []
                else:
                    break

        page = (resp.json().get("data") or {}).get("avatar_list") or []
        before = len(looks_by_id)
        for look in page:
            lid = look.get("id")
            if lid:
                looks_by_id[str(lid)] = look
        if not page:
            break
        if len(looks_by_id) == before and offset > 0:
            break
        if len(page) < limit:
            break
        offset += limit

    return _avatar_group_looks_to_rows(looks_by_id, group_id, group_name)


async def _heygen_merge_avatar_group_lists(client: httpx.AsyncClient) -> List[Dict[str, Any]]:
    """Union of account groups and public groups (deduped by group id)."""
    merged: Dict[str, Dict[str, Any]] = {}
    for params in ({}, {"include_public": "true"}):
        try:
            r = await client.get("/v2/avatar_group.list", params=params)
            r.raise_for_status()
        except (httpx.HTTPStatusError, httpx.RequestError):
            continue
        for g in (r.json().get("data") or {}).get("avatar_group_list") or []:
            gid = g.get("id")
            if gid and str(gid) not in merged:
                merged[str(gid)] = g
    return list(merged.values())


def _normalize_v2_avatar_rows(
    studio_list: List[Dict[str, Any]],
    tp_list: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Turn HeyGen /v2/avatars studio + talking_photo payloads into UI rows."""
    normalized: List[Dict[str, Any]] = []
    for a in studio_list:
        aid = a.get("avatar_id")
        if not aid:
            continue
        normalized.append(
            {
                "id": aid,
                "name": a.get("avatar_name"),
                "gender": a.get("gender"),
                "preview_image_url": a.get("preview_image_url"),
                "default_voice_id": a.get("default_voice_id"),
                "kind": "avatar",
            }
        )
    for tp in tp_list:
        tid = tp.get("talking_photo_id")
        if not tid:
            continue
        normalized.append(
            {
                "id": tid,
                "name": tp.get("talking_photo_name"),
                "gender": tp.get("gender"),
                "preview_image_url": tp.get("preview_image_url"),
                "default_voice_id": None,
                "kind": "talking_photo",
            }
        )
    return normalized


async def _heygen_fetch_avatar_group_look_rows(
    client: httpx.AsyncClient,
) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Photo-avatar group looks only (slow; many HeyGen calls)."""
    meta: Dict[str, Any] = {
        "avatar_group_look_rows": 0,
        "group_list_merged_count": 0,
        "group_fetch_exceptions": 0,
    }
    rows: List[Dict[str, Any]] = []
    raw_groups = await _heygen_merge_avatar_group_lists(client)
    meta["group_list_merged_count"] = len(raw_groups)

    sem = asyncio.Semaphore(24)
    tasks = [
        _heygen_fetch_group_looks(
            client,
            sem,
            str(g.get("id")),
            str(g.get("name") or ""),
        )
        for g in raw_groups
        if g.get("id")
    ]
    if tasks:
        chunks = await asyncio.gather(*tasks, return_exceptions=True)
        for ch in chunks:
            if isinstance(ch, Exception):
                meta["group_fetch_exceptions"] += 1
                continue
            rows.extend(ch)
        meta["avatar_group_look_rows"] = sum(
            len(x) for x in chunks if isinstance(x, list)
        )
    return rows, meta


@app.get("/heygen/avatars")
async def heygen_avatars(response: Response) -> Dict[str, Any]:
    """
    Same catalog as ``GET https://api.heygen.com/v2/avatars`` (studio + talking photos only).

    Kept separate from photo-avatar **group** looks so this response stays small and reliable
    (matches what you get from ``heygen_avatars_dump.json``). Extra pages use offset/limit when
    HeyGen supports them.

    Response: ``{ "avatars": [...], "meta": { studio_avatar_rows, talking_photo_rows, v2_row_total } }``.
    """
    response.headers["Cache-Control"] = "no-store"
    api_key = _get_heygen_api_key()
    headers = {"x-api-key": api_key}
    timeout = httpx.Timeout(120.0, connect=20.0)
    limits = httpx.Limits(max_keepalive_connections=32, max_connections=64)

    async with httpx.AsyncClient(
        base_url=HEYGEN_BASE_URL,
        headers=headers,
        timeout=timeout,
        limits=limits,
    ) as client:
        try:
            studio_list, tp_list = await _heygen_fetch_v2_avatars_all_pages(client)
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=502,
                detail=f"HeyGen request failed: {e.response.status_code}",
            ) from e
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail="HeyGen request failed") from e

    normalized = _normalize_v2_avatar_rows(studio_list, tp_list)
    meta = {
        "studio_avatar_rows": len(studio_list),
        "talking_photo_rows": len(tp_list),
        "v2_row_total": len(normalized),
    }
    return {"avatars": normalized, "meta": meta}


@app.get("/heygen/avatar-group-looks")
async def heygen_avatar_group_looks(response: Response) -> Dict[str, Any]:
    """
    All looks from ``/v2/avatar_group.list`` (account + public) and each
    ``/v2/avatar_group/{id}/avatars``. Slow; call after ``/heygen/avatars`` has loaded.

    Disable with ``HEYGEN_FETCH_AVATAR_GROUPS=0``.
    """
    response.headers["Cache-Control"] = "no-store"
    if os.getenv("HEYGEN_FETCH_AVATAR_GROUPS", "1").strip().lower() in ("0", "false", "no"):
        return {"avatars": [], "meta": {"skipped": True}}

    api_key = _get_heygen_api_key()
    headers = {"x-api-key": api_key}
    timeout = httpx.Timeout(300.0, connect=20.0)
    limits = httpx.Limits(max_keepalive_connections=32, max_connections=64)

    async with httpx.AsyncClient(
        base_url=HEYGEN_BASE_URL,
        headers=headers,
        timeout=timeout,
        limits=limits,
    ) as client:
        try:
            rows, meta = await _heygen_fetch_avatar_group_look_rows(client)
        except (httpx.HTTPStatusError, httpx.RequestError):
            return {"avatars": [], "meta": {"error": True}}

    return {"avatars": rows, "meta": meta}


@app.get("/heygen/voices")
def heygen_voices() -> Dict[str, List[Dict[str, Any]]]:
    """Fetch available AI voices from HeyGen (v2)."""
    payload = _heygen_get_json("/v2/voices")
    data = payload.get("data") or {}
    voices = data.get("voices") or []

    normalized: List[Dict[str, Any]] = []
    for v in voices:
        normalized.append(
            {
                "voice_id": v.get("voice_id"),
                "name": v.get("name"),
                "language": v.get("language"),
                "gender": v.get("gender"),
                "preview_audio": v.get("preview_audio"),
                "support_pause": v.get("support_pause"),
                "emotion_support": v.get("emotion_support"),
                "support_interactive_avatar": v.get("support_interactive_avatar"),
                "support_locale": v.get("support_locale"),
            }
        )

    return {"voices": normalized}


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

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(file_bytes))
        pages: List[str] = []

        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text)

        return "\n".join(pages).strip()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read PDF file: {str(e)}",
        )


def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = Document(BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs).strip()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read DOCX file: {str(e)}",
        )


def clean_extracted_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


async def extract_lesson_content_from_upload(file: UploadFile) -> str:
    filename = (file.filename or "").lower()

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if filename.endswith(".pdf"):
        extracted = extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        extracted = extract_text_from_docx(file_bytes)
    elif filename.endswith(".doc"):
        raise HTTPException(
            status_code=400,
            detail="DOC files are not supported yet. Please upload a PDF or DOCX file.",
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF or DOCX file.",
        )

    extracted = clean_extracted_text(extracted)

    if not extracted:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from the uploaded file.",
        )

    return extracted

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
        lesson_content = await extract_lesson_content_from_upload(file)

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


# ==================== USER-SPECIFIC ENDPOINTS ====================

@app.post("/users/me/avatars", response_model=dict)
async def save_user_avatar(
    avatar_data: UserAvatarCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a user's selected HeyGen avatar to their collection."""
    # Clear any failed transactions to start with clean session
    db.rollback()

    print(f"DEBUG: === save_user_avatar ENDPOINT CALLED ===")
    print(f"DEBUG: avatar_data type: {type(avatar_data)}")
    print(f"DEBUG: current_user type: {type(current_user)}")
    print(f"DEBUG: current_user value: {current_user}")
    print(f"DEBUG: db type: {type(db)}")

    if current_user is None:
        print(f"DEBUG: ERROR - current_user is None!")
        raise HTTPException(status_code=401, detail="Authentication failed - current_user is None")

    print(f"DEBUG: current_user.user_id: {current_user.user_id}")
    print(f"DEBUG: avatar_data.heygen_data: {avatar_data.heygen_data}")

    try:
        # Create new avatar record
        print(f"DEBUG: Creating new AIAvatar object")
        new_avatar = AIAvatar(
            name=avatar_data.custom_name or avatar_data.heygen_data.avatar_name,
            voice_id=avatar_data.heygen_data.default_voice_id or "",
            type="heygen",
            owner_id=current_user.user_id,
            configuration=json.dumps(avatar_data.heygen_data.dict())  # Serialize to JSON string
        )

        print(f"DEBUG: Adding avatar to database")
        db.add(new_avatar)
        db.commit()
        db.refresh(new_avatar)

        print(f"DEBUG: Avatar saved successfully with ID: {new_avatar.avatar_id}")
        return {
            "success": True,
            "message": "Avatar saved successfully",
            "avatar_id": new_avatar.avatar_id
        }
    except Exception as e:
        print(f"DEBUG: Exception in save_user_avatar: {type(e).__name__}: {e}")
        import traceback
        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save avatar: {str(e)}")


@app.get("/users/me/avatars", response_model=List[dict])
async def get_user_avatars(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all avatars saved by the current user."""
    # Clear any failed transactions to start with clean session
    db.rollback()

    avatars = db.query(AIAvatar).filter(
        AIAvatar.owner_id == current_user.user_id
    ).all()

    result = []
    for avatar in avatars:
        # Deserialize JSON configuration back to dict
        heygen_data = None
        if avatar.configuration:
            try:
                heygen_data = json.loads(avatar.configuration) if isinstance(avatar.configuration, str) else avatar.configuration
            except (json.JSONDecodeError, TypeError):
                heygen_data = avatar.configuration  # Fallback to raw data

        avatar_data = {
            "avatar_id": avatar.avatar_id,
            "name": avatar.name,
            "voice_id": avatar.voice_id,
            "type": avatar.type,
            "heygen_data": heygen_data
        }
        result.append(avatar_data)

    return result


@app.delete("/users/me/avatars/{avatar_id}", response_model=dict)
async def delete_user_avatar(
    avatar_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a saved avatar owned by the current user."""
    db.rollback()

    avatar = db.query(AIAvatar).filter(AIAvatar.avatar_id == avatar_id).first()
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    if avatar.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this avatar")

    # Preserve generated videos by unlinking avatar_id before avatar delete.
    db.query(GeneratedVideo).filter(GeneratedVideo.avatar_id == avatar_id).update(
        {GeneratedVideo.avatar_id: None},
        synchronize_session=False,
    )
    db.delete(avatar)
    db.commit()
    return {"success": True, "message": "Avatar removed"}


@app.patch("/users/me/avatars/{avatar_id}", response_model=dict)
async def rename_user_avatar(
    avatar_id: int,
    body: AvatarNameUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Rename a saved avatar owned by the current user."""
    db.rollback()

    avatar = db.query(AIAvatar).filter(AIAvatar.avatar_id == avatar_id).first()
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    if avatar.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not allowed to rename this avatar")

    avatar.name = body.name.strip()
    db.commit()
    db.refresh(avatar)
    return {"success": True, "message": "Avatar renamed", "name": avatar.name}


@app.post("/users/me/content", response_model=SourceContentResponse)
async def upload_user_content(
    title: str = Form(...),
    source_type: str = Form("upload"),
    file: Optional[UploadFile] = File(None),
    content_text: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and store lesson content for a user."""
    # Clear any failed transactions to start with clean session
    db.rollback()

    try:
        content_data = content_text

        # If file is provided, extract text and optionally store file in S3
        if file:
            content_data = await extract_lesson_content_from_upload(file)

            # Optionally store original file in S3 (if S3 is available)
            if file.content_type in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
                try:
                    file_bytes = await file.read()
                    s3_key = f"files/user_{current_user.user_id}/{file.filename or 'document'}"
                    _upload_bytes_to_s3(file_bytes, s3_key, content_type=file.content_type)
                    content_data += f"\n\n[Original file stored at: {s3_key}]"
                except Exception:
                    content_data += f"\n\n[Note: File upload to S3 failed]"

        # Create source content record
        source_content = SourceContent(
            creator_id=current_user.user_id,
            title=title,
            source_type=source_type,
            source_data=content_data
        )

        db.add(source_content)
        db.commit()
        db.refresh(source_content)

        return source_content

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save content: {str(e)}")


@app.get("/users/me/content", response_model=List[SourceContentResponse])
async def get_user_content(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all content uploaded by the current user."""
    # Clear any failed transactions to start with clean session
    db.rollback()

    content = db.query(SourceContent).filter(
        SourceContent.creator_id == current_user.user_id
    ).order_by(SourceContent.updated_at.desc()).all()

    return content


@app.get("/users/me/videos", response_model=List[GeneratedVideoWithDetails])
async def get_user_videos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all videos generated by the current user."""
    # Clear any failed transactions to start with clean session
    db.rollback()

    videos = db.query(GeneratedVideo).options(
        joinedload(GeneratedVideo.source_content),
        joinedload(GeneratedVideo.avatar)
    ).filter(
        GeneratedVideo.creator_id == current_user.user_id
    ).order_by(GeneratedVideo.generated_at.desc()).all()

    result = []
    for video in videos:
        video_data = {
            "video_id": video.video_id,
            "source_content_id": video.source_content_id,
            "creator_id": video.creator_id,
            "avatar_id": video.avatar_id,
            "video_url": video.video_url,
            "presigned_url": None,
            "scorm_package_url": video.scorm_package_url,
            "generation_status": video.generation_status,
            "generated_at": video.generated_at,
            "version": video.version,
            "source_content": video.source_content,
            "avatar": video.avatar
        }

        # Generate presigned URL if video is available and S3 is configured
        if video.s3_key and video.generation_status == "completed":
            video_data["presigned_url"] = _generate_presigned_url(video.s3_key)

        result.append(video_data)

    return result
