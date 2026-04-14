import os
import uuid
import httpx
import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import GeneratedVideo
from ..schemas import VideoCreate, VideoResponse

router = APIRouter(prefix="/videos", tags=["videos"])

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv"}
S3_PRESIGNED_URL_EXPIRY = 3600  # seconds (1 hour)


def _get_s3_client():
    """
    Returns a boto3 S3 client.
    On EC2 the IAM role is picked up automatically — no keys needed.
    For local dev, set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in .env.
    """
    region = os.getenv("AWS_REGION", "us-east-2")
    access_key = os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    if access_key and secret_key:
        return boto3.client(
            "s3",
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
        )
    # Falls back to IAM role on EC2
    return boto3.client("s3", region_name=region)


def _get_bucket_name() -> str:
    name = os.getenv("AWS_S3_BUCKET_NAME", "yanka-videos")
    return name


def _upload_bytes_to_s3(file_bytes: bytes, s3_key: str, content_type: str = "video/mp4") -> str:
    """Upload raw bytes to S3 and return the S3 key."""
    s3 = _get_s3_client()
    bucket = _get_bucket_name()
    try:
        s3.put_object(
            Bucket=bucket,
            Key=s3_key,
            Body=file_bytes,
            ContentType=content_type,
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {e}")
    return s3_key


def _generate_presigned_url(s3_key: str) -> str:
    """Generate a pre-signed URL for the given S3 key (valid for 1 hour)."""
    s3 = _get_s3_client()
    bucket = _get_bucket_name()
    try:
        url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": s3_key},
            ExpiresIn=S3_PRESIGNED_URL_EXPIRY,
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate video URL: {e}")
    return url


def _attach_presigned_url(video: GeneratedVideo) -> VideoResponse:
    """Build a VideoResponse with a fresh pre-signed URL."""
    url = _generate_presigned_url(video.s3_key) if video.s3_key else None
    return VideoResponse(
        video_id=video.video_id,
        creator_id=video.creator_id,
        avatar_id=video.avatar_id,
        title=video.title,
        s3_key=video.s3_key,
        playback_url=url,
        heygen_video_id=video.heygen_video_id,
        source=video.source,
        generation_status=video.generation_status,
        language=video.language,
        generated_at=video.generated_at,
    )


# --- Endpoints ---

@router.post("/from-heygen", response_model=VideoResponse, status_code=201)
async def store_heygen_video(
    heygen_video_id: str = Form(...),
    video_url: str = Form(...),       # the URL returned by GET /video/status/{id}
    title: str = Form(...),
    user_id: Optional[int] = Form(None),
    avatar_id: Optional[int] = Form(None),
    language: Optional[str] = Form("english"),
    db: Session = Depends(get_db),
):
    """
    Download a completed HeyGen video and store it in S3 + DB.
    Call this after GET /video/status/{heygen_video_id} returns status='completed'.
    """
    # Download the video bytes from HeyGen's CDN URL
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.get(video_url)
            resp.raise_for_status()
            video_bytes = resp.content
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to download video from HeyGen: {e}")

    s3_key = f"videos/heygen/{uuid.uuid4()}.mp4"
    _upload_bytes_to_s3(video_bytes, s3_key, content_type="video/mp4")

    record = GeneratedVideo(
        creator_id=user_id,
        avatar_id=avatar_id,
        title=title,
        s3_key=s3_key,
        video_url=f"s3://yanka-videos/{s3_key}",  # non-expiring reference; use s3_key for playback URLs
        heygen_video_id=heygen_video_id,
        source="heygen",
        generation_status="ready",
        language=language,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return _attach_presigned_url(record)


@router.post("/upload", response_model=VideoResponse, status_code=201)
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form(...),
    user_id: Optional[int] = Form(None),
    avatar_id: Optional[int] = Form(None),
    language: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Upload a video file directly to S3 + DB.
    Accepts mp4, mov, avi, webm, mkv.
    """
    filename = (file.filename or "").lower()
    ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ""
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}",
        )

    video_bytes = await file.read()
    if not video_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    content_type = file.content_type or "video/mp4"
    s3_key = f"videos/uploads/{uuid.uuid4()}{ext}"
    _upload_bytes_to_s3(video_bytes, s3_key, content_type=content_type)

    record = GeneratedVideo(
        creator_id=user_id,
        avatar_id=avatar_id,
        title=title,
        s3_key=s3_key,
        video_url=f"s3://yanka-videos/{s3_key}",  # non-expiring reference; use s3_key for playback URLs
        heygen_video_id=None,
        source="upload",
        generation_status="ready",
        language=language,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return _attach_presigned_url(record)


@router.get("/{video_id}", response_model=VideoResponse)
def get_video(video_id: int, db: Session = Depends(get_db)):
    """Retrieve a stored video record with a fresh pre-signed playback URL."""
    video = db.query(GeneratedVideo).filter(GeneratedVideo.video_id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return _attach_presigned_url(video)


@router.get("", response_model=List[VideoResponse])
def list_videos(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    List all stored videos. Pass ?user_id=<id> to filter by user.
    Each record includes a fresh pre-signed playback URL.
    """
    query = db.query(GeneratedVideo)
    if user_id is not None:
        query = query.filter(GeneratedVideo.creator_id == user_id)
    videos = query.order_by(GeneratedVideo.generated_at.desc()).all()
    return [_attach_presigned_url(v) for v in videos]
