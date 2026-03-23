from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
import os
import json
import asyncio
import httpx
import jwt  # pip install PyJWT cryptography
from jwt import PyJWKClient
from pathlib import Path
from model.model import predict as model_predict

load_dotenv()

# ── Paths ──
BACKEND_DIR   = Path(__file__).resolve().parent.parent          # .../backend/
VIDEO_PATH    = BACKEND_DIR.parent / "frontend" / "public" / "video" / "test.mp4"
TRANSCRIPT_PATH = BACKEND_DIR / "app" / "transcript.json"


def build_transcript() -> None:
    """Transcribe test.mp4 with Whisper and save timestamped segments to transcript.json."""
    if not VIDEO_PATH.exists():
        print(f"[YANKA] Video not found at {VIDEO_PATH} — skipping transcription.")
        return
    print("[YANKA] Transcribing video with Whisper (this runs once)…")
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    with open(VIDEO_PATH, "rb") as f:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="verbose_json",
            timestamp_granularities=["segment"],
        )
    segments = [
        {"start": s.start, "end": s.end, "text": s.text}
        for s in response.segments
    ]
    with open(TRANSCRIPT_PATH, "w") as f:
        json.dump(segments, f, indent=2)
    print(f"[YANKA] Transcript saved ({len(segments)} segments).")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not TRANSCRIPT_PATH.exists():
        build_transcript()
    yield


app = FastAPI(
    title="YANKA API",
    description="Backend API for YANKA",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#### Cognito settings ####
COGNITO_REGION = "us-east-2"
USER_POOL_ID = "us-east-2_yURBgXWYb"
APP_CLIENT_ID = "1pet7h6f4ddn8fam0v1681gpdm"
ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"

# Cache the JWKS client so keys are only fetched once
jwks_client = PyJWKClient(JWKS_URL)
security = HTTPBearer()


def verify_cognito_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Validates the Bearer JWT from Cognito.
    Raises 401 if the token is missing, expired, or tampered with.
    Returns the decoded token claims on success.
    """
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=ISSUER,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


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

    return {
        "response": completion.choices[0].message.content}


# ── Avatar Session ──

LIVEAVATAR_API      = "https://api.liveavatar.com"
LIVEAVATAR_KEY      = os.getenv("LIVEAVATAR_API_KEY", "")
LIVEAVATAR_VOICE_ID = os.getenv("LIVEAVATAR_VOICE_ID", "")

@app.post("/api/avatar/session")
async def create_avatar_session():
    """
    Creates a LiveAvatar FULL-mode session and returns the LiveKit credentials
    needed for the frontend to connect and stream the avatar video.
    LiveAvatar sessions end automatically when the LiveKit participant disconnects —
    there is no server-side API endpoint to forcibly stop them.
    If the concurrency limit is hit (previous session still closing), we wait and retry once.
    """
    if not LIVEAVATAR_KEY:
        raise HTTPException(status_code=500, detail="LIVEAVATAR_API_KEY not configured")

    async with httpx.AsyncClient(timeout=20) as client:
        start_data, session_token, session_id = await _start_session(client)

        if start_data is None:
            # Concurrency limit hit — wait for the old session to fully close, then retry once
            print("[YANKA] Concurrency limit hit; waiting 8 s for previous session to close…")
            await asyncio.sleep(8)
            start_data, session_token, session_id = await _start_session(client)

        if start_data is None:
            raise HTTPException(
                status_code=429,
                detail="An avatar session is still closing. Please wait a moment and try again.",
            )

    livekit_url   = start_data.get("livekit_url")   or start_data.get("livekitUrl")
    livekit_token = (start_data.get("livekit_client_token")
                     or start_data.get("livekit_token")
                     or start_data.get("livekitToken"))

    print(f"[YANKA] Session started: {session_id}")
    return {
        "session_id":    session_id,
        "session_token": session_token,
        "livekit_url":   livekit_url,
        "livekit_token": livekit_token,
    }


async def _start_session(client: httpx.AsyncClient) -> tuple[dict | None, str | None, str | None]:
    """
    Creates a LiveAvatar token then starts the session.
    Returns (start_data, session_token, session_id) on success, or (None, None, None)
    if the concurrency limit (code 4032) is hit.
    Raises HTTPException for any other error.
    """
    persona: dict = {"language": "en"}
    if LIVEAVATAR_VOICE_ID:
        persona["voice_id"] = LIVEAVATAR_VOICE_ID

    token_resp = await client.post(
        f"{LIVEAVATAR_API}/v1/sessions/token",
        headers={"X-API-KEY": LIVEAVATAR_KEY, "content-type": "application/json"},
        json={
            "mode": "FULL",
            "is_sandbox": True,
            "avatar_id": "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a",  # Wayne — only sandbox avatar
            "avatar_persona": persona,
        },
    )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"LiveAvatar token error: {token_resp.text}")

    inner         = token_resp.json().get("data", token_resp.json())
    session_token = inner.get("session_token") or inner.get("sessionToken")
    session_id    = inner.get("session_id")    or inner.get("sessionId")

    if not session_token or not session_id:
        raise HTTPException(status_code=502, detail=f"Unexpected token response: {token_resp.json()}")

    start_resp = await client.post(
        f"{LIVEAVATAR_API}/v1/sessions/start",
        headers={"authorization": f"Bearer {session_token}", "accept": "application/json"},
    )

    if start_resp.status_code == 403 and start_resp.json().get("code") == 4032:
        return None, None, None

    if start_resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"LiveAvatar start error: {start_resp.text}")

    return start_resp.json().get("data", start_resp.json()), session_token, session_id


@app.delete("/api/avatar/session/{session_id}")
async def stop_avatar_session(session_id: str):
    """
    Acknowledges a session stop request.
    LiveAvatar sessions end automatically when the LiveKit participant disconnects —
    no server-side API call is needed or available.
    """
    print(f"[YANKA] Session stop acknowledged (client disconnects LiveKit): {session_id}")
    return {"ok": True}


# ── Video Help ──

class VideoHelpRequest(BaseModel):
    timestamp: float  # seconds into the video


def load_transcript_context(timestamp: float, lookback: float = 180.0) -> str:
    """Return transcript text from the lookback window up to the student's current position."""
    if not TRANSCRIPT_PATH.exists():
        return ""
    with open(TRANSCRIPT_PATH) as f:
        segments = json.load(f)
    lo = max(0.0, timestamp - lookback)
    relevant = [s["text"].strip() for s in segments if s["start"] <= timestamp and s["end"] >= lo]
    return " ".join(relevant).strip()


@app.post("/api/video-help")
def video_help(request: VideoHelpRequest):
    """
    Returns an AI-generated summary, key points, and suggested questions
    for the portion of the video around the given timestamp.
    """
    context = load_transcript_context(request.timestamp)

    if not context:
        return {
            "summary": "No transcript is available for this video yet.",
            "keyPoints": [],
            "suggestedQuestions": [],
        }

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    system = (
        "You are an educational assistant. The student is watching a video lesson "
        "and has asked for help understanding the section they just watched. "
        "Based on the transcript excerpt provided, respond with JSON in exactly this shape:\n"
        '{ "summary": "...", "keyPoints": [{ "point": "...", "explanation": "..." }], "suggestedQuestions": [{ "question": "...", "answer": "..." }] }\n'
        "summary: 2-3 sentences explaining the section in plain language.\n"
        "keyPoints: 3-5 objects, each with a short 'point' label and a detailed 'explanation' of that concept, explaining them in more detail.\n"
        "suggestedQuestions: 3 objects, each with a 'question' the student should be able to answer and a full 'answer' to that question.\n"
        "Return only valid JSON, no markdown fences."
        
        "You are an educational assistant. The student is watching a video lesson "
        "and has asked for help understanding the section they just watched. "
        "Based on the transcript excerpt provided, respond with JSON in exactly this shape:\n"
        '{ "summary": "...", "keyPoints": [{ "point": "...", "explanation": "..." }], "suggestedQuestions": [{ "question": "...", "answer": "..." }] }\n'
        "summary: 2-3 sentences explaining the section in plain language.\n"
        "keyPoints: 3-5 objects, each with a short 'point' label and a detailed 'explanation' of that concept, explaining them in more detail.\n"
        "suggestedQuestions: 3 objects, each with a 'question' the student should be able to answer and a full 'answer' to that question.\n"
        "Return only valid JSON, no markdown fences."
    )

    user_msg = (
        f"The student is at {int(request.timestamp // 60)}m {int(request.timestamp % 60)}s "
        f"in the video. Here is the relevant transcript:\n\n{context}"
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content or "{}"
    data = json.loads(raw)

    return {
        "summary": data.get("summary", ""),
        "keyPoints": [
            {"point": k.get("point", ""), "explanation": k.get("explanation", "")}
            for k in data.get("keyPoints", [])
        ],
        "suggestedQuestions": [
            {"question": q.get("question", ""), "answer": q.get("answer", "")}
            for q in data.get("suggestedQuestions", [])
        ],
    }