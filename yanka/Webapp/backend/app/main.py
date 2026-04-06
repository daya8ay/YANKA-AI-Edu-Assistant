import os
import re
from typing import Any, Dict, List, Optional, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

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

    return {"response": completion.choices[0].message.content}


HEYGEN_BASE_URL = "https://api.heygen.com"

# Substrings that usually indicate stylized / game / lifestyle / cartoon avatars.
# HeyGen does not expose a "professional only" API filter; this is a best-effort server-side filter.
_CASUAL_AVATAR_SUBSTRINGS: Tuple[str, ...] = (
    "anime",
    "avatar_iv_stylized",
    "bikini",
    "cartoon",
    "caricature",
    "casual",
    "chibi",
    "clubbing",
    "comic",
    "cosplay",
    "costume",
    "creature",
    "cyborg",
    "dj ",
    " dj",
    "dragon",
    "festival",
    "fortnite",
    "furry",
    "gaming",
    "halloween",
    "illustrated",
    "illustration",
    "kawaii",
    "manga",
    "mascot",
    "meme",
    "metaverse",
    "minecraft",
    "monster",
    "nightclub",
    "parkour",
    "party",
    "pixel",
    "playful",
    "pirate",
    "pool",
    "quirky",
    "rave",
    "roblox",
    "robot",
    " rollers",
    "skate",
    "ski ",
    " snowboard",
    "streetwear",
    "summer",
    "superhero",
    "surf ",
    "swimsuit",
    "tiktok",
    "toon",
    "toy ",
    "villain",
    "voxel",
    "wizard",
    "witch",
    "zombie",
    "alien",
    "ninja",
    "samurai",
    "warcraft",
    "battle",
    "arena",
    "fantasy",
    " scifi",
    "sci-fi",
    "steampunk",
    " sports",
    "sportswear",
    "athlete",
    " jersey",
    "basketball",
    "football",
    "soccer",
    "hockey",
    "yoga",
    "gym",
    "workout",
    "mermaid",
    "fairy",
    "vampire",
    "werewolf",
    "circus",
    "clown",
    "rockstar",
    "rapper",
    "hiphop",
    "hip-hop",
    "santa",
)

# Short tokens matched as whole words to reduce false positives (e.g. "orc" inside "Orchestra").
_CASUAL_AVATAR_WORD_PATTERNS: Tuple[re.Pattern[str], ...] = tuple(
    re.compile(rf"\b{re.escape(w)}\b", re.IGNORECASE)
    for w in (
        "beach",
        "cute",
        "dj",
        "elf",
        "elves",
        "emoji",
        "game",
        "gamer",
        "knight",
        "meme",
        "orc",
        "party",
        "park",
        "santa",
        "plush",
        "streamer",
        "warrior",
        "zombie",
    )
)


# For rigged "studio" avatars: keep rows that look like workplace / presenter contexts.
# Many casual avatars still have innocent display names; id + this gate cuts most junk.
_PROFESSIONAL_STUDIO_HINTS: Tuple[str, ...] = (
    "office",
    "studio",
    "corporate",
    "business",
    "formal",
    "professional",
    "executive",
    "workplace",
    "meeting",
    "conference",
    "presentation",
    "webinar",
    "interview",
    "broadcast",
    "news",
    "anchor",
    "reporter",
    "presenter",
    "lecture",
    "classroom",
    "education",
    "teacher",
    "professor",
    "training",
    "sales",
    "desk",
    "laptop",
    "whiteboard",
    "zoom",
    "medical",
    "doctor",
    "nurse",
    "hospital",
    "clinic",
    "labcoat",
    "lawyer",
    "court",
    "expressive",
    "upper_body",
    "upper body",
    "half_body",
    "half body",
    "blazer",
    "suit",
    "podcast",
)


def _avatar_blob(
    name: Any = None,
    id_value: Any = None,
    tags: Any = None,
    typ: Any = None,
) -> str:
    parts: List[str] = []
    if name:
        parts.append(str(name))
    if id_value:
        parts.append(str(id_value))
    if isinstance(tags, list):
        parts.extend(str(t) for t in tags)
    if typ:
        parts.append(str(typ))
    return " ".join(parts).lower()


def _casual_avatar_blob(avatar: Dict[str, Any]) -> str:
    return _avatar_blob(
        avatar.get("avatar_name"),
        avatar.get("avatar_id"),
        avatar.get("tags"),
        avatar.get("type"),
    )


def _casual_talking_photo_blob(tp: Dict[str, Any]) -> str:
    return _avatar_blob(
        tp.get("talking_photo_name"),
        tp.get("talking_photo_id"),
        tp.get("tags"),
        tp.get("type"),
    )


def _is_likely_casual(blob: str) -> bool:
    if any(s in blob for s in _CASUAL_AVATAR_SUBSTRINGS):
        return True
    if any(p.search(blob) for p in _CASUAL_AVATAR_WORD_PATTERNS):
        return True
    return False


def _is_likely_casual_studio_avatar(avatar: Dict[str, Any]) -> bool:
    return _is_likely_casual(_casual_avatar_blob(avatar))


def _looks_professional_studio_avatar(avatar: Dict[str, Any]) -> bool:
    blob = _casual_avatar_blob(avatar)
    return any(h in blob for h in _PROFESSIONAL_STUDIO_HINTS)


# --- "Teacher / headshot" mode (default): bust-up office or presenter looks, not lifestyle wide shots ---

_TEACHER_STUDIO_EXCLUDE_RE = re.compile(
    r"gym|sofa|outdoor|beach|pool|bed(room)?|kitchen|\bparty\b|halloween|christmas|santa|"
    r"bikini|swimsuit|\bsport|parkour|\bskate|picnic|camping|full_body|full body|"
    r"outdoorchair|outdoorcasual|living_?room|nightclub|festival|\brave\b|\bdj\b|"
    r"rollerskate|\broller\b|snowboard|surf\b|yoga\b|workout\b|clubbing",
    re.IGNORECASE,
)

# Studio avatars must match at least one of these (headshot framing or teacher/w workplace).
_TEACHER_STUDIO_KEEP_HINTS: Tuple[str, ...] = (
    "upper_body",
    "upper body",
    "half_body",
    "half body",
    "close_up",
    "close up",
    "closeup",
    "expressive",
    "office",
    "biztalk",
    "business",
    "teacher",
    "lecture",
    "classroom",
    "presenter",
    "professor",
    "news",
    "anchor",
    "reporter",
    "professional",
    "formal",
    "executive",
    "corporate",
    "workplace",
    "meeting",
    "conference",
    "webinar",
    "interview",
    "presentation",
    "desk",
    "blazer",
    "suit",
    "medical",
    "doctor",
    "nurse",
    "hospital",
    "clinic",
    "labcoat",
    "lawyer",
    "court",
    "podcast",
    "training",
    "education",
    "standing_studio",
    "sitting_studio",
)

_IN_SHIRT_ID_RE = re.compile(r"in_[a-z]+_shirt", re.IGNORECASE)


def _teacher_studio_excluded(avatar: Dict[str, Any]) -> bool:
    s = (avatar.get("avatar_id") or "") + " " + (avatar.get("avatar_name") or "")
    return bool(_TEACHER_STUDIO_EXCLUDE_RE.search(s))


def _teacher_studio_keeps(avatar: Dict[str, Any]) -> bool:
    blob = _casual_avatar_blob(avatar)
    if any(h in blob for h in _TEACHER_STUDIO_KEEP_HINTS):
        return True
    aid = avatar.get("avatar_id") or ""
    alower = aid.lower()
    if "public" in alower:
        return True
    if _IN_SHIRT_ID_RE.search(aid):
        return True
    aname = avatar.get("avatar_name") or ""
    if re.search(r"in [a-z]+ shirt", aname, re.IGNORECASE):
        return True
    if re.search(r"\bblazer\b", aname, re.IGNORECASE):
        return True
    if re.search(r"\bbusiness\b", aname, re.IGNORECASE):
        return True
    return False


_ILLUSTRATED_TALKING_PHOTO_RE = re.compile(
    r"illustrat|cartoon|comic|anime|manga|pixar|\b3d\b|stylized|chibi|"
    r"draw(n|ing)?|furry|mascot|emoji|figurine|clay\b|low-?poly|"
    r"fantasy|wizard|dragon|zombie|robot\b|superhero|sprite\b|videogame|video game",
    re.IGNORECASE,
)


def _is_illustrated_talking_photo(tp: Dict[str, Any]) -> bool:
    s = (tp.get("talking_photo_name") or "") + " " + (tp.get("talking_photo_id") or "")
    return bool(_ILLUSTRATED_TALKING_PHOTO_RE.search(s))


def _get_heygen_api_key() -> str:
    key = os.getenv("HEYGEN_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="Missing HEYGEN_API_KEY on the backend environment.",
        )
    return key


def _heygen_get_json(path: str) -> Dict[str, Any]:
    api_key = _get_heygen_api_key()
    url = f"{HEYGEN_BASE_URL}{path}"
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.get(url, headers={"x-api-key": api_key})
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as e:
        # Avoid leaking sensitive details; surface a safe message.
        raise HTTPException(status_code=502, detail=f"HeyGen request failed: {e.response.status_code}")


@app.get("/heygen/avatars")
def heygen_avatars(response: Response) -> Dict[str, List[Dict[str, Any]]]:
    """
    Fetch Public avatars and Talking Photos from HeyGen (v2).

    Returned format is normalized for the frontend selector:
    [{ id, name, gender?, preview_image_url, default_voice_id?, kind }]
    (gender from HeyGen is typically "female" / "male" for studio avatars; may be null.)

    Filtering modes (HEYGEN_AVATAR_LIST_FILTER):
    - teacher (default): headshot / teacher-style presenters using HeyGen studio avatars only
      (bust-up or office/classroom contexts; excludes gym, sofa, outdoor lifestyle, etc.).
      Talking photos are omitted — they appear after studio avatars in HeyGen’s API and are a
      mixed bag visually. Set HEYGEN_AVATAR_TEACHER_INCLUDE_TALKING_PHOTOS=1 to include them.
    - professional: prior behavior — casual denylist + workplace/presenter hint gate on studio;
      talking photos: casual denylist only.
    - loose: casual denylist for both studio avatars and talking photos (no hint gate).
    - all: no filtering.
    """
    list_filter = (os.getenv("HEYGEN_AVATAR_LIST_FILTER") or "teacher").strip().lower()
    no_filter = list_filter == "all"
    loose_only = list_filter == "loose"
    teacher_mode = list_filter == "teacher"
    teacher_include_photos = (
        os.getenv("HEYGEN_AVATAR_TEACHER_INCLUDE_TALKING_PHOTOS", "").strip().lower()
        in ("1", "true", "yes")
    )

    response.headers["Cache-Control"] = "no-store"

    payload = _heygen_get_json("/v2/avatars")
    data = payload.get("data") or {}

    avatars = data.get("avatars") or []
    talking_photos = data.get("talking_photos") or []

    normalized: List[Dict[str, Any]] = []

    for a in avatars:
        if not no_filter:
            if _is_likely_casual_studio_avatar(a):
                continue
            if teacher_mode:
                if _teacher_studio_excluded(a):
                    continue
                if not _teacher_studio_keeps(a):
                    continue
            elif not loose_only:
                if not _looks_professional_studio_avatar(a):
                    continue
        normalized.append(
            {
                "id": a.get("avatar_id"),
                "name": a.get("avatar_name"),
                "gender": a.get("gender"),
                "preview_image_url": a.get("preview_image_url"),
                "default_voice_id": a.get("default_voice_id"),
                "kind": "avatar",
            }
        )

    for tp in talking_photos:
        if teacher_mode and not teacher_include_photos:
            continue
        if not no_filter:
            if _is_likely_casual(_casual_talking_photo_blob(tp)):
                continue
            # With talking photos re-enabled in teacher mode, drop illustrated / character looks.
            if teacher_mode and _is_illustrated_talking_photo(tp):
                continue
        normalized.append(
            {
                "id": tp.get("talking_photo_id"),
                "name": tp.get("talking_photo_name"),
                "gender": tp.get("gender"),
                "preview_image_url": tp.get("preview_image_url"),
                "default_voice_id": None,
                "kind": "talking_photo",
            }
        )

    if teacher_mode:
        normalized.sort(key=lambda x: (x.get("name") or "").lower())

    return {"avatars": normalized}


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
