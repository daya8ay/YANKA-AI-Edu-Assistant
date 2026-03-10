export const runtime = "nodejs";

import OpenAI from "openai";
import { createRemoteJWKSet, jwtVerify } from "jose";

// ── Cognito JWKS ──────────────────────────────────────────────────────────────
const COGNITO_REGION = "us-east-2";
const USER_POOL_ID = "us-east-2_yURBgXWYb";
const ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`;
const APP_CLIENT_ID = "522dd7m8krgsqj1pjmu135to34";

// createRemoteJWKSet caches the keys automatically
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

async function verifyToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: APP_CLIENT_ID,
    });
    return true;
  } catch {
    return false;
  }
}

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are YANKA's support assistant. Only answer questions related to YANKA's features,
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
Platform | AI Video Generation | Real-Time AI Avatars | AI Training Programs
Wide Range of Courses | AI Data Analysis & Visualization | Thesis & Dissertation Builder

## Pricing (4 Plans)
- Learn (Free): AI chatbot access; Unlimited AI video creation; Study planner & progress tracker; Limited daily questions; Community Q&A
- Plus ($9.99/month): Unlimited AI tutor sessions; AI essay & assignment assistant; Research & Thesis Builder; AI avatars & video creation; Advanced study analytics
- Scholar ($24.99/month): All Plus features; Full Academic & Research Suite; Collaboration tools; Priority support; Document cloud backup
- Institution (from $2,499/month): Full academic + learning ecosystem; Custom branding; API & LMS integration; Institutional analytics; Admin control & compliance

## Support
If a user wants to talk to a human, tell them to call "123-456-7890".
`;

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Verify Cognito token
  const authHeader = req.headers.get("Authorization");
  const isValid = await verifyToken(authHeader);
  if (!isValid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Call OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    return Response.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}