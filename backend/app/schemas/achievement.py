from pydantic import BaseModel

class AchievementCreate(BaseModel):
    code: str
    label: str
    description: str
    threshold: int

class AchievementRead(AchievementCreate):
    id: int
    class Config:
        from_attributes = True