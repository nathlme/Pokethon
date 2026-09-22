from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.team import Team
from app.schemas.team import TeamCreate, TeamUpdate, TeamOut
from app.core.security import get_current_user
from app.services.team_service import auto_generate_team
from app.schemas.team_slot import TeamSlotOut

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/me", response_model=TeamOut)
def get_my_team(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    team = db.query(Team).filter(Team.user_id == current_user.id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Aucune équipe trouvée")
    return team

@router.post("/", response_model=TeamOut, status_code=201)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = db.query(Team).filter(Team.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Une équipe existe déjà pour cet utilisateur")

    team = Team(name=team_in.name, user_id=current_user.id)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.put("/{team_id}", response_model=TeamOut)
def rename_team(team_id: int, team_in: TeamUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Équipe introuvable")
    if team.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cette équipe ne vous appartient pas")

    team.name = team_in.name
    db.commit()
    db.refresh(team)
    return team

@router.post("/auto-generate", response_model=list[TeamSlotOut])
def auto_generate(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    team = db.query(Team).filter(Team.user_id == current_user.id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Aucune équipe trouvée")

    captures = current_user.captures
    if not captures:
        raise HTTPException(status_code=400, detail="Aucune capture disponible pour générer une équipe")

    return auto_generate_team(db, team, captures)