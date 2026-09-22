from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.team import Team
from app.models.team_slot import TeamSlot
from app.schemas.team_slot import TeamSlotCreate, TeamSlotOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/team-slots", tags=["team-slots"])

MAX_SLOTS = 6

@router.post("/", response_model=TeamSlotOut, status_code=201)
def add_capture_to_team(slot_in: TeamSlotCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    team = db.query(Team).filter(Team.id == slot_in.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Équipe introuvable")
    if team.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cette équipe ne vous appartient pas")

    current_count = db.query(TeamSlot).filter(TeamSlot.team_id == team.id).count()
    if current_count >= MAX_SLOTS:
        raise HTTPException(status_code=409, detail="L'équipe est déjà complète (6/6)")

    duplicate = db.query(TeamSlot).filter(
        TeamSlot.team_id == team.id, TeamSlot.capture_id == slot_in.capture_id
    ).first()
    if duplicate:
        raise HTTPException(status_code=409, detail="Cette capture est déjà dans l'équipe")

    position_taken = db.query(TeamSlot).filter(
        TeamSlot.team_id == team.id, TeamSlot.position == slot_in.position
    ).first()
    if position_taken:
        raise HTTPException(status_code=409, detail=f"Le slot {slot_in.position} est déjà occupé")

    slot = TeamSlot(**slot_in.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.delete("/{slot_id}", status_code=204)
def remove_capture_from_team(slot_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    slot = db.query(TeamSlot).filter(TeamSlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot introuvable")
    if slot.team.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ce slot ne vous appartient pas")

    db.delete(slot)
    db.commit()