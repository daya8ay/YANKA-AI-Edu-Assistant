from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, Dict, Any, List
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

class HeyGenAvatarData(BaseModel):
    """Schema for HeyGen avatar JSON data."""
    avatar_id: str
    avatar_name: str
    gender: Optional[str] = None
    preview_image_url: Optional[str] = None
    preview_video_url: Optional[str] = None
    premium: Optional[bool] = None
    type: Optional[str] = None
    tags: Optional[str] = None
    default_voice_id: Optional[str] = None


class AvatarCreate(BaseModel):
    name: Optional[str] = None
    voice_id: str
    type: Optional[str] = None
    heygen_data: Optional[HeyGenAvatarData] = None  # Store full HeyGen response


class AvatarResponse(BaseModel):
    avatar_id: int
    name: Optional[str]
    voice_id: Optional[str]
    type: Optional[str]
    owner_id: Optional[int]
    configuration: Optional[Dict[str, Any]]  # HeyGen data stored as JSON

    class Config:
        from_attributes = True


class UserAvatarCreate(BaseModel):
    """Schema for saving a user's selected HeyGen avatar."""
    heygen_data: HeyGenAvatarData


class UserAvatarResponse(BaseModel):
    """Schema for returning user's saved avatars."""
    avatar_id: int
    name: Optional[str]
    voice_id: Optional[str]
    heygen_data: Optional[HeyGenAvatarData]
    created_at: datetime

    class Config:
        from_attributes = True


# --- GeneratedVideo Table Schemas ---

class VideoCreate(BaseModel):
    title: str
    creator_id: Optional[int] = None
    avatar_id: Optional[int] = None
    language: Optional[str] = None


class VideoResponse(BaseModel):
    video_id: int
    creator_id: Optional[int]
    avatar_id: Optional[int]
    title: Optional[str]
    s3_key: Optional[str]
    playback_url: Optional[str]         # pre-signed S3 URL, generated on the fly
    heygen_video_id: Optional[str]
    source: Optional[str]
    generation_status: Optional[str]
    language: Optional[str]
    generated_at: Optional[datetime]

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


# --- SourceContent Table Schemas ---

class SourceContentCreate(BaseModel):
    title: str
    source_type: Optional[str] = None
    source_data: Optional[str] = None


class SourceContentResponse(BaseModel):
    content_id: int
    creator_id: int
    title: str
    source_type: Optional[str]
    source_data: Optional[str]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# --- GeneratedVideos Table Schemas ---

class VideoGenerateRequest(BaseModel):
    """Request schema for generating a new video."""
    source_content_id: int
    avatar_id: int
    script: Optional[str] = None


class GeneratedVideoCreate(BaseModel):
    source_content_id: int
    creator_id: int
    avatar_id: int
    video_url: Optional[str] = None
    scorm_package_url: Optional[str] = None
    generation_status: Optional[str] = "pending"
    version: Optional[int] = 1


class GeneratedVideoResponse(BaseModel):
    video_id: int
    source_content_id: int
    creator_id: int
    avatar_id: int
    video_url: Optional[str]
    scorm_package_url: Optional[str]
    generation_status: Optional[str]
    generated_at: Optional[datetime]
    version: Optional[int]

    class Config:
        from_attributes = True


class GeneratedVideoWithDetails(BaseModel):
    """Detailed response including related data."""
    video_id: int
    source_content_id: int
    creator_id: int
    avatar_id: int
    video_url: Optional[str]
    presigned_url: Optional[str]  # Pre-signed S3 URL for secure access
    scorm_package_url: Optional[str]
    generation_status: Optional[str]
    generated_at: Optional[datetime]
    version: Optional[int]

    # Related data
    source_content: Optional[SourceContentResponse] = None
    avatar: Optional[AvatarResponse] = None

    class Config:
        from_attributes = True


# --- Organization Table Schemas ---

class OrganizationCreate(BaseModel):
    name: str
    type: Optional[str] = None
    branding_details: Optional[Dict[str, Any]] = None


class OrganizationResponse(BaseModel):
    organization_id: int
    name: str
    type: Optional[str]
    branding_details: Optional[Dict[str, Any]]
    admin_id: Optional[int]

    class Config:
        from_attributes = True


# --- VideoInteraction Table Schemas ---

class VideoInteractionCreate(BaseModel):
    video_id: int
    timestamp_in_video: float
    data: Dict[str, Any]


class VideoInteractionResponse(BaseModel):
    interaction_id: int
    video_id: int
    timestamp_in_video: float
    data: Dict[str, Any]

    class Config:
        from_attributes = True


# --- File Upload Schemas ---

class FileUploadResponse(BaseModel):
    """Response for file uploads to S3."""
    file_url: str
    content_id: Optional[int] = None  # If saved to SourceContent
    message: str
