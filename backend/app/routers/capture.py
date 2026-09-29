from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.capture import Capture
from app.models.pokemons import Pokemon
from app.schemas.capture import CaptureCreate, CaptureRead, CaptureUpdate
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/captures", tags=["captures"])


def get_own_capture(capture_id: int, db: Session, current_user: User) -> Capture:
    db_capture = db.query(Capture).filter(Capture.id == capture_id).first()
    if not db_capture:
        raise HTTPException(status_code=404, detail="Capture introuvable")
    if db_capture.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cette capture ne vous appartient pas")
    return db_capture


@router.get("", response_model=list[CaptureRead])
def list_my_captures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Capture).filter(Capture.user_id == current_user.id).all()


@router.get("/{capture_id}", response_model=CaptureRead)
def get_capture(
    capture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_own_capture(capture_id, db, current_user)


@router.post("", response_model=CaptureRead, status_code=201)
def catch_pokemon(
    payload: CaptureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Pokemon).filter(Pokemon.id == payload.pokemon_id).first():
        raise HTTPException(status_code=404, detail="Pokémon introuvable")
    db_capture = Capture(
        user_id=current_user.id,
        pokemon_id=payload.pokemon_id,
        nickname=payload.nickname,
    )
    db.add(db_capture)
    db.commit()
    db.refresh(db_capture)
    return db_capture


@router.patch("/{capture_id}", response_model=CaptureRead)
def rename_capture(
    capture_id: int,
    payload: CaptureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_capture = get_own_capture(capture_id, db, current_user)
    db_capture.nickname = payload.nickname
    db.commit()
    db.refresh(db_capture)
    return db_capture


@router.delete("/{capture_id}", status_code=204)
def release_pokemon(
    capture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_capture = get_own_capture(capture_id, db, current_user)
    db.delete(db_capture)
    db.commit()
