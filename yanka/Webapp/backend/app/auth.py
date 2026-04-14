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
    print(f"DEBUG: verify_cognito_token called with credentials: {credentials}")
    token = credentials.credentials
    print(f"DEBUG: Token length: {len(token) if token else 'None'}")
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=ISSUER,
        )
        print(f"DEBUG: Token verified successfully. Payload keys: {list(payload.keys())}")
        print(f"DEBUG: Payload sub: {payload.get('sub')}, email: {payload.get('email')}")
        return payload
    except jwt.ExpiredSignatureError as e:
        print(f"DEBUG: Token expired: {e}")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        print(f"DEBUG: Invalid token: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e:
        print(f"DEBUG: Unexpected error in verify_cognito_token: {e}")
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")


def get_or_create_user(cognito_payload: dict, db: Session) -> User:
    """
    Get existing user or create new user from Cognito token payload.

    Args:
        cognito_payload: JWT payload from Cognito token
        db: Database session

    Returns:
        User object from database
    """
    # Clear any failed transactions to start with clean session
    db.rollback()

    print(f"DEBUG: === get_or_create_user CALLED ===")
    print(f"DEBUG: Function entry - cognito_payload type: {type(cognito_payload)}")
    print(f"DEBUG: Function entry - db type: {type(db)}")

    try:
        print(f"DEBUG: Step 1 - Extracting cognito_sub and email")
        cognito_sub = cognito_payload.get("sub")
        email = cognito_payload.get("email", "")
        given_name = cognito_payload.get("given_name", "")
        family_name = cognito_payload.get("family_name", "")

        print(f"DEBUG: Step 1 - Extracted values:")
        print(f"  cognito_sub: '{cognito_sub}'")
        print(f"  email: '{email}'")
        print(f"  given_name: '{given_name}'")
        print(f"  family_name: '{family_name}'")

        if not cognito_sub:
            print(f"DEBUG: ERROR - Missing cognito_sub in token payload")
            raise HTTPException(status_code=401, detail="Invalid token: missing sub")

        print(f"DEBUG: Step 2 - Querying for existing user by cognito_sub")
        user = None

        # Try to find existing user by Cognito sub ID first
        try:
            query_result = db.query(User).filter(User.cognito_sub == cognito_sub).first()
            print(f"DEBUG: Step 2 - Query by cognito_sub completed")
            if query_result:
                print(f"DEBUG: Step 2 - FOUND user by cognito_sub: user_id={query_result.user_id}, email={query_result.email}")
                user = query_result
            else:
                print(f"DEBUG: Step 2 - NO user found by cognito_sub")
        except Exception as e:
            print(f"DEBUG: Step 2 - ERROR querying by cognito_sub: {type(e).__name__}: {e}")
            user = None

        if not user and email:
            print(f"DEBUG: Step 3 - Querying for existing user by email")
            try:
                query_result = db.query(User).filter(User.email == email).first()
                print(f"DEBUG: Step 3 - Query by email completed")
                if query_result:
                    print(f"DEBUG: Step 3 - FOUND user by email: user_id={query_result.user_id}")
                    user = query_result
                    # Try to update cognito_sub
                    try:
                        print(f"DEBUG: Step 3 - Updating cognito_sub for existing user")
                        user.cognito_sub = cognito_sub
                        db.commit()
                        db.refresh(user)
                        print(f"DEBUG: Step 3 - Successfully updated cognito_sub")
                    except Exception as e:
                        print(f"DEBUG: Step 3 - ERROR updating cognito_sub: {type(e).__name__}: {e}")
                        db.rollback()
                else:
                    print(f"DEBUG: Step 3 - NO user found by email")
            except Exception as e:
                print(f"DEBUG: Step 3 - ERROR querying by email: {type(e).__name__}: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")

        if not user:
            print(f"DEBUG: Step 4 - Creating new user")
            try:
                print(f"DEBUG: Step 4 - Constructing User object")
                user = User(
                    cognito_sub=cognito_sub,
                    email=email,
                    first_name=given_name,
                    last_name=family_name,
                    role="student",
                    account_status="active"
                )
                print(f"DEBUG: Step 4 - User object created, adding to db")
                db.add(user)
                print(f"DEBUG: Step 4 - Committing to database")
                db.commit()
                print(f"DEBUG: Step 4 - Refreshing user object")
                db.refresh(user)
                print(f"DEBUG: Step 4 - SUCCESS - Created new user with ID: {user.user_id}")
            except Exception as e:
                print(f"DEBUG: Step 4 - ERROR creating user: {type(e).__name__}: {e}")
                db.rollback()
                raise HTTPException(status_code=500, detail=f"Failed to create user: {e}")

        if not user:
            print(f"DEBUG: ERROR - user is still None after all attempts")
            raise HTTPException(status_code=500, detail="Failed to get or create user")

        print(f"DEBUG: Step 5 - SUCCESS - Returning user with ID: {user.user_id}")
        print(f"DEBUG: === get_or_create_user COMPLETED ===")
        return user

    except HTTPException as e:
        print(f"DEBUG: HTTPException in get_or_create_user: {e.detail}")
        raise
    except Exception as e:
        print(f"DEBUG: Unexpected error in get_or_create_user: {type(e).__name__}: {e}")
        import traceback
        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Authentication error: {e}")


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
    print(f"DEBUG: get_current_user called")
    print(f"DEBUG: cognito_payload type: {type(cognito_payload)}, db type: {type(db)}")
    print(f"DEBUG: cognito_payload: {cognito_payload}")

    if not cognito_payload:
        print(f"DEBUG: cognito_payload is None or empty!")
        raise HTTPException(status_code=401, detail="No authentication payload")

    if not db:
        print(f"DEBUG: db session is None!")
        raise HTTPException(status_code=500, detail="Database session unavailable")

    try:
        user = get_or_create_user(cognito_payload, db)
        print(f"DEBUG: get_current_user returning user: {user.user_id if user else None}")
        return user
    except Exception as e:
        print(f"DEBUG: Exception in get_current_user: {e}")
        raise


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
