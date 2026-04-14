from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, UniqueConstraint, ForeignKey, text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users" 
    
    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False)
    language_preference = Column(String(10))
    profile_picture_url = Column(String(255))
    account_status = Column(String(50))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    last_login = Column(TIMESTAMP(timezone=True))

    progress = relationship("LearningProgress", back_populates="user")


class AIAvatar(Base):
    __tablename__ = "ai_avatars"

    avatar_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    heygen_avatar_id = Column(String(255))
    voice_id = Column(String(255))


class LearningProgress(Base):
    __tablename__ = "learningprogress"

    progress_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    video_id = Column(Integer, nullable=False)
    # ^^^ FK to generatedvideos is enforced at DB level (init.sql). 
    # omitting it here so that SQLAlchemy doesn't get mad while we don't have a generatedVideos model.
    status = Column(String(50))
    score = Column(Float)
    last_viewed_timestamp = Column(Float, default=0)

    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    user = relationship("User", back_populates="progress")


class GeneratedVideo(Base):
    __tablename__ = "generatedvideos"

    # Columns from init.sql (constraints relaxed to nullable for our use case)
    video_id = Column(Integer, primary_key=True, index=True)
    source_content_id = Column(Integer, nullable=True)  # FK to sourcecontent enforced at DB level
    creator_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    avatar_id = Column(Integer, ForeignKey("ai_avatars.avatar_id"), nullable=True)
    video_url = Column(String(255))         # S3 URL stored here
    scorm_package_url = Column(String(255))
    generation_status = Column(String(50), default="ready")
    generated_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    version = Column(Integer, default=1)

    # Added via migration (see migrate_add_generated_videos.py)
    title = Column(String(255))
    s3_key = Column(String(512))            # S3 object key — used to generate pre-signed URLs
    heygen_video_id = Column(String(255))   # HeyGen's video_id (null for user uploads)
    source = Column(String(50))             # 'heygen' or 'upload'
    language = Column(String(50))
