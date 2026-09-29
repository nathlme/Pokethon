from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.pokemon_type import pokemon_type
from app.database import Base


class Type(Base):
    __tablename__ = "types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    pokemons = relationship("Pokemon", secondary=pokemon_type, back_populates="types"
)