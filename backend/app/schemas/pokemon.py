from pydantic import BaseModel, ConfigDict


class TypeRead(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class PokemonCreate(BaseModel):
    pokeapi_id: int
    name: str
    sprite_url: str | None = None
    hp: int
    attack: int
    defense: int
    speed: int


class PokemonRead(BaseModel):
    id: int
    name: str
    type: str
    sprite_url: str | None = None
    hp: int
    attack: int
    defense: int
    speed: int
    types: list[TypeRead]

    model_config = ConfigDict(from_attributes=True)