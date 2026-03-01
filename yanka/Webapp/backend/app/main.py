from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from openai import OpenAI
import os

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


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "YANKA API", "docs": "/docs"}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    message_content = """You are YANKA's support assistant.Only answer questions related to YANKA's features,
      pricing, and account issues. If asked anything unrelated, politely decline and redirect the user.
      Be concise, polite, and brief in your answers.

      ## About YANKA
      YANKA is an all-in-one intelligent platform designed to revolutionize how the world learns, teaches,
      researches, and creates. Built with cutting-edge AI, YANKA combines voice-enabled tutoring, AI avatar
      video creation, academic research tools, professional training development, and a fully integrated
      knowledge marketplace. YANKA is more than an app — it is a 21st-century global learning ecosystem
      empowering students, researchers, educators, professionals, institutions, NGOs, governments, and
      lifelong learners worldwide.

      ## Features
      Platform
      AI Video Generation
      Real-Time AI Avatars
      AI Training Programs
      Wide Range of Courses
      AI Data Analysis & Visualization
      Thesis & Dissertation Builder
       
       ## Pricing (4 Plans)
       Learn: Free = AI chatbot access;Unlimited AI video creation;Study planner & progress tracker;Limited daily questions;Access to community Q&A
       Plus: $9.99/month = Unlimited AI tutor sessions;AI essay & assignment assistant;Research & Thesis Builder (standard mode);AI avatars & video creation;Advanced study analytics
       Scholar: $24.99/month = All Plus features; Full Academic & Research Suite;Collaboration tools;Priority support;Document cloud backup
       Instituion: starting at $2499/month = Full academic + learning ecosystem;Custom branding;API & LMS integration;Institutional analytics;Admin control & compliance

       ## Support number
       If users want to talk to a human tell them to call at "123-456-7890"
       """
    
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": message_content
            },
            {
                "role": "user",
                "content": request.message
            }
        ]
    )
    
    return {"response": completion.choices[0].message.content}
