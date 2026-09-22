from pydantic import BaseModel, Field, ConfigDict

class TeamSlotCreate(BaseModel):
    team_id: int
    capture_id: int
    position: int = Field(ge=1, le=6)

class TeamSlotOut(BaseModel):
    id: int
    team_id: int
    capture_id: int
    position: int

    model_config = ConfigDict(from_attributes=True)