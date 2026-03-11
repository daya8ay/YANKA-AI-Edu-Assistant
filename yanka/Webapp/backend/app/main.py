from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
import os
import httpx
import jwt  # pip install PyJWT cryptography
from jwt import PyJWKClient

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