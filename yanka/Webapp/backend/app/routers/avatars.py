from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import AIAvatar
from ..schemas import AvatarCreate, AvatarResponse

router = APIRouter(prefix="/avatars", tags=["avatars"])


@router.post("", response_model=AvatarResponse, status_code=201)
def create_avatar(avatar: AvatarCreate, db: Session = Depends(get_db)):
    new_avatar = AIAvatar(
        name=avatar.name,
        voice_id=avatar.voice_id,
    )
    db.add(new_avatar)
    db.commit()
    db.refresh(new_avatar)
    return new_avatar


@router.get("/{avatar_id}", response_model=AvatarResponse)
def get_avatar(avatar_id: int, db: Session = Depends(get_db)):
    avatar = db.query(AIAvatar).filter(AIAvatar.avatar_id == avatar_id).first()
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    return avatar


@router.get("", response_model=List[AvatarResponse])
def get_all_avatars(db: Session = Depends(get_db)):
    return db.query(AIAvatar).all()
