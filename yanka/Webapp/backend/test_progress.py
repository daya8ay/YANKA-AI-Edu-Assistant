"""
Tests for POST /progress and GET /progress/{user_id} endpoints.

Requires:
- Native WSL2 Postgres running (sudo service postgresql start)
- .env file present with DATABASE_URL

Run with:
    cd yanka/Webapp/backend
    python3 test_progress.py
"""

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, LearningProgress
from sqlalchemy import text

client = TestClient(app)


def setup_test_data():
    """
    LearningProgress has foreign keys to Users and GeneratedVideos.
    We need valid rows in both tables before we can insert a progress record.
    GeneratedVideos also requires SourceContent and AI_Avatars rows first.
    We insert all of these directly via SQL to keep the setup simple.
    """
    db = SessionLocal()

    # Clean up any leftover test data from previous runs (reverse FK order)
    db.query(LearningProgress).filter(LearningProgress.user_id.in_(
        db.query(User.user_id).filter(User.email == "progress_test@yanka.com")
    )).delete(synchronize_session=False)
    db.execute(text("DELETE FROM generatedvideos WHERE video_id = 9999"))
    db.execute(text("DELETE FROM sourcecontent WHERE content_id = 9999"))
    db.execute(text("DELETE FROM ai_avatars WHERE avatar_id = 9999"))
    db.query(User).filter(User.email == "progress_test@yanka.com").delete()
    db.commit()

    # Insert a test user
    db.execute(text("""
        INSERT INTO users (email, role, account_status)
        VALUES ('progress_test@yanka.com', 'student', 'active')
    """))

    # Insert the minimum required rows to satisfy GeneratedVideos foreign keys
    db.execute(text("""
        INSERT INTO sourcecontent (content_id, creator_id, title)
        SELECT 9999, user_id, 'Test Content'
        FROM users WHERE email = 'progress_test@yanka.com'
    """))
    db.execute(text("""
        INSERT INTO ai_avatars (avatar_id, name)
        VALUES (9999, 'Test Avatar')
    """))
    db.execute(text("""
        INSERT INTO generatedvideos (video_id, source_content_id, creator_id, avatar_id, generation_status)
        SELECT 9999, 9999, user_id, 9999, 'completed'
        FROM users WHERE email = 'progress_test@yanka.com'
    """))
    db.commit()

    user_id = db.execute(
        text("SELECT user_id FROM users WHERE email = 'progress_test@yanka.com'")
    ).scalar()
    db.close()
    return user_id


def teardown_test_data(user_id):
    # Delete in reverse FK order: progress -> video -> source/avatar -> user
    db = SessionLocal()
    db.query(LearningProgress).filter(LearningProgress.user_id == user_id).delete()
    db.execute(text("DELETE FROM generatedvideos WHERE video_id = 9999"))
    db.execute(text("DELETE FROM sourcecontent WHERE content_id = 9999"))
    db.execute(text("DELETE FROM ai_avatars WHERE avatar_id = 9999"))
    db.query(User).filter(User.user_id == user_id).delete()
    db.commit()
    db.close()


def test_create_progress(user_id):
    """
    Happy path — create a progress record for a valid user + video pair.
    Expects 201 with the saved record returned.
    """
    response = client.post("/progress", json={
        "user_id": user_id,
        "video_id": 9999,
        "status": "in_progress",
        "score": 72.5,
        "last_viewed_timestamp": 30.0,
    })

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.json()}"
    data = response.json()
    assert data["user_id"] == user_id
    assert data["video_id"] == 9999
    assert data["status"] == "in_progress"
    assert data["score"] == 72.5
    assert "progress_id" in data
    print("PASS  test_create_progress")


def test_duplicate_progress(user_id):
    """
    400 Bad Request — a progress record for this user+video already exists.
    The DB enforces UNIQUE (user_id, video_id).
    """
    response = client.post("/progress", json={
        "user_id": user_id,
        "video_id": 9999,
        "status": "in_progress",
    })

    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert "already exists" in response.json()["detail"]
    print("PASS  test_duplicate_progress")


def test_get_progress(user_id):
    """
    Happy path — fetch all progress records for a user.
    Should return a list containing the record we created above.
    """
    response = client.get(f"/progress/{user_id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(r["video_id"] == 9999 for r in data)
    print("PASS  test_get_progress")


def test_get_progress_empty():
    """
    GET /progress for a user with no records should return an empty list, not a 404.
    """
    response = client.get("/progress/999999")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert response.json() == []
    print("PASS  test_get_progress_empty")


if __name__ == "__main__":
    user_id = setup_test_data()
    try:
        test_create_progress(user_id)
        test_duplicate_progress(user_id)
        test_get_progress(user_id)
        test_get_progress_empty()
        print("\nAll tests passed.")
    finally:
        teardown_test_data(user_id)
