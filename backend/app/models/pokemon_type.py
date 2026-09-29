from sqlalchemy import Table, Column, Integer, ForeignKey

from app.database import Base


pokemon_type = Table("pokemon_type", Base.metadata, 
    Column( "pokemon_id", Integer, ForeignKey("pokemons.id"), primary_key=True),
    Column("type_id",Integer, ForeignKey("types.id"), primary_key=True),
)