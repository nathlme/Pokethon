from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Capture(Base):
    __tablename__ = "captures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pokemon_id = Column(Integer, ForeignKey("pokemons.id"))
    nickname = Column(String, nullable=True)
    caught_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="captures")
    pokemon = relationship("Pokemon")
