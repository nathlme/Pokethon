from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# achievement (déf badges)

class AchievementBase(BaseModel):
    code: str = Field(..., examples=["collector_10"])
    label: str
    description: str | None = None
    threshold: int | None = None


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    code: str | None = None
    label: str | None = None
    description: str | None = None
    threshold: int | None = None


class AchievementOut(AchievementBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# UserAchievement (badge débloqué par user)

class UserAchievementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    achievement_id: int
    unlocked_at: datetime
    achievement: AchievementOut 