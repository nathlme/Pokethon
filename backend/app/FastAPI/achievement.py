from sqlalchemy import Column, Integer, String, Text
from database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    label = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    threshold = Column(Integer, nullable=True)