from pydantic import BaseModel
from datetime import datetime

class UserAchievementCreate(BaseModel):
    achievement_id: int

class UserAchievementRead(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    unlocked_at: datetime

    class Config:
        from_attributes = True