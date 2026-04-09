from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# --- User Table Schemas ---

class UserCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    role: str
    language_preference: Optional[str] = None


class UserResponse(BaseModel):
    user_id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    role: str
    language_preference: Optional[str]
    profile_picture_url: Optional[str]
    account_status: Optional[str]
    created_at: Optional[datetime]
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


# --- AIAvatar Table Schemas ---

class AvatarCreate(BaseModel):
    name: Optional[str] = None
    heygen_avatar_id: Optional[str] = None
    voice_id: str


class AvatarResponse(BaseModel):
    avatar_id: int
    name: Optional[str]
    heygen_avatar_id: Optional[str]
    voice_id: Optional[str]

    class Config:
        from_attributes = True


# --- LearningProgress Table Schemas ---

class LearningProgressCreate(BaseModel):
    user_id: int
    video_id: int
    status: Optional[str] = None
    score: Optional[float] = None
    last_viewed_timestamp: Optional[float] = 0.0


class LearningProgressResponse(BaseModel):
    progress_id: int
    user_id: int
    video_id: int
    status: Optional[str]
    score: Optional[float]
    last_viewed_timestamp: Optional[float]

    class Config:
        from_attributes = True
