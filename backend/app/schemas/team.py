from pydantic import BaseModel, ConfigDict

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: str

class TeamOut(TeamBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)