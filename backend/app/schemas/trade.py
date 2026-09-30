from datetime import datetime
from pydantic import BaseModel


class TradeCreate(BaseModel):
    to_user_id: int
    offered_capture_id: int
    requested_capture_id: int


class TradeRead(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int

    offered_capture_id: int
    requested_capture_id: int

    offered_pokemon_id: int | None = None
    requested_pokemon_id: int | None = None

    offered_nickname: str | None = None
    requested_nickname: str | None = None

    status: str
    created_at: datetime

    class Config:
        orm_mode = True