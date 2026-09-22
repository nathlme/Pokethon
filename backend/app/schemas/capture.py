from pydantic import BaseModel, ConfigDict
from typing import Optional

class CaptureCreate(BaseModel):
    pokemon_id: int
    nickname: Optional[str] = None

class CaptureRead(BaseModel):
    id: int
    user_id: int
    pokemon_id: int
    nickname: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)