DROP TABLE IF EXISTS ConsentLog;
DROP TABLE IF EXISTS UserSubscriptions;
DROP TABLE IF EXISTS SubscriptionPlans;
DROP TABLE IF EXISTS UserAnalyticsEvents;
DROP TABLE IF EXISTS LearningProgress;
DROP TABLE IF EXISTS VideoInteractions;
DROP TABLE IF EXISTS GeneratedVideos;
DROP TABLE IF EXISTS AI_Avatars;
DROP TABLE IF EXISTS SourceContent;
DROP TABLE IF EXISTS User_Organizations;
DROP TABLE IF EXISTS Organizations;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    language_preference VARCHAR(10),
    profile_picture_url VARCHAR(255),
    account_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

CREATE TABLE Organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    branding_details JSONB,
    admin_id INTEGER REFERENCES Users(user_id)
);

CREATE TABLE User_Organizations (
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    organization_id INTEGER NOT NULL REFERENCES Organizations(organization_id),
    PRIMARY KEY (user_id, organization_id)
);

CREATE TABLE SourceContent (
    content_id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL REFERENCES Users(user_id),
    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(50),
    source_data TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AI_Avatars (
    avatar_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    owner_id INTEGER REFERENCES Users(user_id),
    configuration JSONB
);

CREATE TABLE GeneratedVideos (
    video_id SERIAL PRIMARY KEY,
    source_content_id INTEGER NOT NULL REFERENCES SourceContent(content_id),
    creator_id INTEGER NOT NULL REFERENCES Users(user_id),
    avatar_id INTEGER NOT NULL REFERENCES AI_Avatars(avatar_id),
    video_url VARCHAR(255),
    scorm_package_url VARCHAR(255),
    generation_status VARCHAR(50),
    generated_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1
);

CREATE TABLE VideoInteractions (
    interaction_id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES GeneratedVideos(video_id),
    timestamp_in_video REAL NOT NULL,
    data JSONB NOT NULL
);

CREATE TABLE LearningProgress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    video_id INTEGER NOT NULL REFERENCES GeneratedVideos(video_id),
    status VARCHAR(50),
    score REAL,
    last_viewed_timestamp REAL DEFAULT 0,
    UNIQUE (user_id, video_id)
);

CREATE TABLE UserAnalytics (
    event_id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    details JSONB
);

CREATE TABLE UserSubscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    organization_id INTEGER REFERENCES Organizations(organization_id),
    plan_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    renewal_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_owner CHECK (
        (user_id IS NOT NULL AND organization_id IS NULL) OR
        (user_id IS NULL AND organization_id IS NOT NULL)
    )
);

CREATE TABLE ConsentLog (
    consent_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    document_type VARCHAR(100) NOT NULL,
    document_version VARCHAR(50) NOT NULL,
    consent_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
