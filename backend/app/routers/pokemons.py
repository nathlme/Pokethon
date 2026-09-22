from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pokemons import Pokemon


router = APIRouter(prefix="/pokemons", tags=["pokemons"])


def serialize(pokemon: Pokemon) -> dict:
    return {
        "id": pokemon.id,
        "name": pokemon.name,
        "type": pokemon.type,
        "sprite_url": pokemon.sprite_url,
        "hp": pokemon.hp,
        "attack": pokemon.attack,
        "defense": pokemon.defense,
        "speed": pokemon.speed,
    }


@router.get("")
def list_pokemons(db: Session = Depends(get_db)):
    pokemons = db.query(Pokemon).order_by(Pokemon.id).all()

    return [serialize(pokemon) for pokemon in pokemons]


@router.get("/{pokemon_id}")
def get_pokemon(pokemon_id: int, db: Session = Depends(get_db)):
    pokemon = db.get(Pokemon, pokemon_id)

    if pokemon is None:
        raise HTTPException(
            status_code=404,
            detail="Pokémon introuvable"
        )

    return serialize(pokemon)