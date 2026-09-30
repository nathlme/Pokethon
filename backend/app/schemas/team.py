from typing import List
from pydantic import BaseModel, ConfigDict
from app.schemas.team_slot import TeamSlotOut

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: str

class TeamOut(TeamBase):
    id: int
    user_id: int
    slots: List[TeamSlotOut] = []

    model_config = ConfigDict(from_attributes=True)