from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(
        Integer,
        ForeignKey("achievements.id"),
        nullable=False
    )
    unlocked_at = Column(DateTime, server_default=func.now())

    achievement = relationship(
        "Achievement",
        back_populates="user_achievements"
    )