from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, UniqueConstraint, ForeignKey, text, JSON, Text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    cognito_sub = Column(String(255), unique=True, nullable=True)  # Cognito user ID
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

    # Relationships
    progress = relationship("LearningProgress", back_populates="user")
    created_content = relationship("SourceContent", back_populates="creator")
    generated_videos = relationship("GeneratedVideos", back_populates="creator")
    owned_avatars = relationship("AIAvatar", back_populates="owner")
    organizations = relationship("Organization", secondary="user_organizations", back_populates="users")


class AIAvatar(Base):
    __tablename__ = "ai_avatars"

    avatar_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    voice_id = Column(String(255))
    type = Column(String(50))
    owner_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    configuration = Column(JSON)  # Store HeyGen avatar JSON data

    # Relationships
    owner = relationship("User", back_populates="owned_avatars")
    generated_videos = relationship("GeneratedVideos", back_populates="avatar")


class LearningProgress(Base):
    __tablename__ = "learningprogress"

    progress_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    video_id = Column(Integer, ForeignKey("generatedvideos.video_id"), nullable=False)
    status = Column(String(50))
    score = Column(Float)
    last_viewed_timestamp = Column(Float, default=0)

    __table_args__ = (UniqueConstraint("user_id", "video_id"),)

    # Relationships
    user = relationship("User", back_populates="progress")
    video = relationship("GeneratedVideos", back_populates="progress")


class Organization(Base):
    __tablename__ = "organizations"

    organization_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50))
    branding_details = Column(JSON)
    admin_id = Column(Integer, ForeignKey("users.user_id"))

    # Relationships
    admin = relationship("User")
    users = relationship("User", secondary="user_organizations", back_populates="organizations")


# Many-to-many association table for users and organizations
class UserOrganization(Base):
    __tablename__ = "user_organizations"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    organization_id = Column(Integer, ForeignKey("organizations.organization_id"), primary_key=True)


class SourceContent(Base):
    __tablename__ = "sourcecontent"

    content_id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    source_type = Column(String(50))
    source_data = Column(Text)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    creator = relationship("User", back_populates="created_content")
    generated_videos = relationship("GeneratedVideos", back_populates="source_content")


class GeneratedVideos(Base):
    __tablename__ = "generatedvideos"

    video_id = Column(Integer, primary_key=True, index=True)
    source_content_id = Column(Integer, ForeignKey("sourcecontent.content_id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    avatar_id = Column(Integer, ForeignKey("ai_avatars.avatar_id"), nullable=False)
    video_url = Column(String(255))  # S3 URL for the MP4 video
    scorm_package_url = Column(String(255))
    generation_status = Column(String(50))
    generated_at = Column(TIMESTAMP(timezone=True))
    version = Column(Integer, default=1)

    # Relationships
    source_content = relationship("SourceContent", back_populates="generated_videos")
    creator = relationship("User", back_populates="generated_videos")
    avatar = relationship("AIAvatar", back_populates="generated_videos")
    interactions = relationship("VideoInteraction", back_populates="video")
    progress = relationship("LearningProgress", back_populates="video")


class VideoInteraction(Base):
    __tablename__ = "videointeractions"

    interaction_id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("generatedvideos.video_id"), nullable=False)
    timestamp_in_video = Column(Float, nullable=False)
    data = Column(JSON, nullable=False)

    # Relationships
    video = relationship("GeneratedVideos", back_populates="interactions")
