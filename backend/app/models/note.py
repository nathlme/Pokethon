from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    capture_id = Column(Integer, ForeignKey("captures.id"), nullable=False)
    content = Column(String, nullable=False)