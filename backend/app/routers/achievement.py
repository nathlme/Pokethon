from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..database import get_db          # adapte l'import à ton arborescence
from ..models import Achievement, UserAchievement
from ..schemas.achievement import (
    AchievementCreate,
    AchievementUpdate,
    AchievementOut,
    UserAchievementOut,
)
from ..auth import get_current_user     

router = APIRouter(prefix="/achievements", tags=["achievements"])


# CRUD sur la définition des badges

@router.get("/", response_model=list[AchievementOut])
def list_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).all()


@router.get("/{achievement_id}", response_model=AchievementOut)
def get_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement introuvable")
    return achievement


@router.post("/", response_model=AchievementOut, status_code=status.HTTP_201_CREATED)
def create_achievement(payload: AchievementCreate, db: Session = Depends(get_db)):
    if db.query(Achievement).filter(Achievement.code == payload.code).first():
        raise HTTPException(status_code=409, detail="Ce code existe déjà")
    achievement = Achievement(**payload.model_dump())
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement


@router.put("/{achievement_id}", response_model=AchievementOut)
def update_achievement(
    achievement_id: int, payload: AchievementUpdate, db: Session = Depends(get_db)
):
    achievement = db.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement introuvable")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(achievement, field, value)
    db.commit()
    db.refresh(achievement)
    return achievement


@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.get(Achievement, achievement_id)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement introuvable")
    db.delete(achievement)
    db.commit()


# Badges débloqués par l'utilisateur connecté

@router.get("/me", response_model=list[UserAchievementOut])
def get_my_achievements(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(UserAchievement)
        .options(joinedload(UserAchievement.achievement))
        .filter(UserAchievement.user_id == current_user.id)
        .order_by(UserAchievement.unlocked_at.desc())
        .all()
    )