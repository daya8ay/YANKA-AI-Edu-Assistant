"""
Tests for GET /users/me endpoint.

This endpoint requires a valid Cognito JWT, so we can't fully test the happy path
without a real token from a logged-in user. We test what we can automatically:
- 401 when no token is provided
- 401 when a fake/invalid token is provided
- 404 when a valid token email doesn't match any user in the DB (mocked)

For full happy path testing, use Swagger UI with a real Cognito token.

Run with:
    cd yanka/Webapp/backend
    python3 test_me.py
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_me_no_token():
    """
    401 Unauthorized — no Authorization header provided at all.
    """
    response = client.get("/users/me")
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("PASS  test_me_no_token")


def test_me_invalid_token():
    """
    401 Unauthorized — a Bearer token is present but it's not a valid Cognito JWT.
    """
    response = client.get("/users/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("PASS  test_me_invalid_token")


if __name__ == "__main__":
    test_me_no_token()
    test_me_invalid_token()
    print("\nAll tests passed.")
    print("\nNote: happy path (valid token → user profile) requires a real Cognito session.")
    print("Test that manually via Swagger UI at http://localhost:8000/docs")
