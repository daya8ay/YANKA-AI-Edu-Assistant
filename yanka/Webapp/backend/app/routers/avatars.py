from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import AIAvatar
from ..schemas import AvatarCreate, AvatarResponse

router = APIRouter(prefix="/avatars", tags=["avatars"])


@router.post("", response_model=AvatarResponse, status_code=201)
def create_avatar(avatar: AvatarCreate, db: Session = Depends(get_db)):
    new_avatar = AIAvatar(
        name=avatar.name,
        voice_id=avatar.voice_id,
        type=avatar.type,
        configuration=json.dumps(avatar.heygen_data.dict()) if avatar.heygen_data else None,
    )
    db.add(new_avatar)
    db.commit()
    db.refresh(new_avatar)
    return new_avatar


def _parse_configuration(avatar: AIAvatar) -> AIAvatar:
    """Deserialize configuration if stored as a JSON string."""
    if isinstance(avatar.configuration, str):
        try:
            avatar.configuration = json.loads(avatar.configuration)
        except (json.JSONDecodeError, TypeError):
            pass
    return avatar


@router.get("/{avatar_id}", response_model=AvatarResponse)
def get_avatar(avatar_id: int, db: Session = Depends(get_db)):
    avatar = db.query(AIAvatar).filter(AIAvatar.avatar_id == avatar_id).first()
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    return _parse_configuration(avatar)


@router.get("", response_model=List[AvatarResponse])
def get_all_avatars(db: Session = Depends(get_db)):
    return [_parse_configuration(a) for a in db.query(AIAvatar).all()]
