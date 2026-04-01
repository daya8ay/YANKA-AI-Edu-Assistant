"""
Tests for POST /users endpoint.

Requires:
- Docker Desktop running
- yanka_postgres_db container running (docker start yanka_postgres_db)
- .env file present with DATABASE_URL

Run with:
    cd yanka/Webapp/backend
    python3 test_users.py
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Clean up any test users left over from previous runs
from app.database import SessionLocal
from app.models import User

def cleanup_test_emails(*emails):
    db = SessionLocal()
    for email in emails:
        db.query(User).filter(User.email == email).delete()
    db.commit()
    db.close()


def test_create_user():
    """
    Happy path — create a brand new user with all required fields.
    Expects a 201 Created response with the user's data returned.
    """
    cleanup_test_emails("happy@yanka.com")

    response = client.post("/users", json={
        "email": "happy@yanka.com",
        "role": "student",
        "first_name": "Happy",
        "last_name": "Path",
    })

    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert data["email"] == "happy@yanka.com"
    assert data["role"] == "student"
    assert data["first_name"] == "Happy"
    assert data["account_status"] == "active"
    assert "password" not in data  # password must never be returned
    print("PASS  test_create_user")


def test_duplicate_email():
    """
    400 Bad Request — the server understood the request but is refusing it
    because that email address is already registered.
    Sending the same email twice should fail on the second attempt.
    """
    cleanup_test_emails("duplicate@yanka.com")

    client.post("/users", json={"email": "duplicate@yanka.com", "role": "student"})
    response = client.post("/users", json={"email": "duplicate@yanka.com", "role": "student"})

    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert response.json()["detail"] == "Email already registered"
    print("PASS  test_duplicate_email")


def test_missing_required_field():
    """
    422 Unprocessable Entity — the request couldn't even be processed
    because a required field is missing or has the wrong format.
    In this case, 'role' is required but not provided.
    """
    response = client.post("/users", json={"email": "norole@yanka.com"})

    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    print("PASS  test_missing_required_field")


def test_invalid_email_format():
    """
    422 Unprocessable Entity — 'email' must be a valid email address.
    Sending a plain string that isn't an email triggers validation failure.
    """
    response = client.post("/users", json={"email": "not-an-email", "role": "student"})

    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    print("PASS  test_invalid_email_format")


if __name__ == "__main__":
    test_create_user()
    test_duplicate_email()
    test_missing_required_field()
    test_invalid_email_format()
    print("\nAll tests passed.")
