from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse
from ..auth import verify_cognito_token

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    claims: dict = Depends(verify_cognito_token),
):
    """
    Returns the profile of the currently logged-in user.
    Reads their email from the Cognito stuff and looks them up in the DB.
    """
    email = claims.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Token does not contain email claim")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        language_preference=user.language_preference,
        account_status="active",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
