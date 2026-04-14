import os
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWKClient
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from typing import Optional

from .database import get_db
from .models import User

load_dotenv()

COGNITO_REGION = "us-east-2"
USER_POOL_ID = "us-east-2_yURBgXWYb"
APP_CLIENT_ID = "1pet7h6f4ddn8fam0v1681gpdm"
ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"

jwks_client = PyJWKClient(JWKS_URL)
security = HTTPBearer()


def verify_cognito_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify Cognito JWT token and return payload.
    """
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=ISSUER,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")


def get_or_create_user(cognito_payload: dict, db: Session) -> User:
    """
    Get existing user or create new user from Cognito token payload.

    Args:
        cognito_payload: JWT payload from Cognito token
        db: Database session

    Returns:
        User object from database
    """
    cognito_sub = cognito_payload.get("sub")
    email = cognito_payload.get("email", "")

    if not cognito_sub:
        raise HTTPException(status_code=401, detail="Invalid token: missing sub")

    # Try to find existing user by Cognito sub ID
    user = db.query(User).filter(User.cognito_sub == cognito_sub).first()

    if not user:
        # Try to find by email and update cognito_sub
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.cognito_sub = cognito_sub
            db.commit()
            db.refresh(user)
        else:
            # Create new user from Cognito data
            user = User(
                cognito_sub=cognito_sub,
                email=email,
                first_name=cognito_payload.get("given_name", ""),
                last_name=cognito_payload.get("family_name", ""),
                role="student",  # Default role
                account_status="active"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    return user


def get_current_user(
    cognito_payload: dict = Depends(verify_cognito_token),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from the database.
    This dependency can be used in API endpoints to get the authenticated user.

    Args:
        cognito_payload: Cognito JWT payload (dependency injected)
        db: Database session (dependency injected)

    Returns:
        User object representing the current authenticated user
    """
    return get_or_create_user(cognito_payload, db)


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if token is provided, otherwise return None.
    Useful for endpoints that work with both authenticated and anonymous users.

    Args:
        credentials: Optional JWT credentials
        db: Database session (dependency injected)

    Returns:
        User object if authenticated, None otherwise
    """
    if not credentials:
        return None

    try:
        # Manually verify token since auto_error=False
        token = credentials.credentials
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=ISSUER,
        )
        return get_or_create_user(payload, db)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
