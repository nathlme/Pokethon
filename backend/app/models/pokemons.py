from sqlalchemy import Column, Integer, String
from app.database import Base


class Pokemon(Base):
    __tablename__ = "pokemons"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(30), nullable=False)
    sprite_url = Column(String(500), nullable=False)

    hp = Column(Integer, nullable=False)
    attack = Column(Integer, nullable=False)
    defense = Column(Integer, nullable=False)
    speed = Column(Integer, nullable=False)