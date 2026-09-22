from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class TeamSlot(Base):
    __tablename__ = "team_slots"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    capture_id = Column(Integer, ForeignKey("captures.id"), nullable=False)
    position = Column(Integer, nullable=False)

    team = relationship("Team", back_populates="slots")

# C'est le modèle de la table "team_slots"
# A mettre en lien avec la table "capture" (qui existe pas encore)