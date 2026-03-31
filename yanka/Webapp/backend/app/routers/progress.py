from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import LearningProgress
from ..schemas import LearningProgressCreate, LearningProgressResponse

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("", response_model=LearningProgressResponse, status_code=201)
def create_progress(progress: LearningProgressCreate, db: Session = Depends(get_db)):
    existing = db.query(LearningProgress).filter(
        LearningProgress.user_id == progress.user_id,
        LearningProgress.video_id == progress.video_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Progress record already exists for this user and video")

    new_progress = LearningProgress(
        user_id=progress.user_id,
        video_id=progress.video_id,
        status=progress.status,
        score=progress.score,
        last_viewed_timestamp=progress.last_viewed_timestamp,
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress


@router.get("/{user_id}", response_model=List[LearningProgressResponse])
def get_progress(user_id: int, db: Session = Depends(get_db)):
    records = db.query(LearningProgress).filter(LearningProgress.user_id == user_id).all()
    return records
