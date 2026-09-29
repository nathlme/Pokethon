from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pokemons import Pokemon
from app.models.type import Type
from app.schemas.pokemon import PokemonCreate, PokemonRead
from app.dependencies import get_current_user

router = APIRouter(prefix="/pokemons", tags=["pokemons"])



@router.get("/{pokemon_id}", response_model=PokemonRead)
def get_pokemon(pokemon_id: int, db: Session = Depends(get_db)):
    pokemon = db.get(Pokemon, pokemon_id)

    if pokemon is None:
        raise HTTPException(
            status_code=404,
            detail="Pokémon introuvable"
        )

    return pokemon


@router.get("", response_model=list[PokemonRead])
def list_pokemons(
    search: str | None = None,
    type: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Pokemon)

    if search:
        query = query.filter(
            Pokemon.name.ilike(f"%{search}%")
       )

    if type:
        query = query.filter(
            Pokemon.types.any(Type.name.ilike(type))
        )

    return query.order_by(Pokemon.id).all()


@router.post("", response_model=PokemonRead, status_code=201)
def create_pokemon(
    pokemon_in: PokemonCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_pokemon = (
        db.query(Pokemon)
        .filter(Pokemon.id == pokemon_in.pokeapi_id)
        .first()
    )

    if existing_pokemon:
        raise HTTPException(
            status_code=409,
            detail="Ce Pokémon existe déjà"
        )

    pokemon = Pokemon(
        id=pokemon_in.pokeapi_id,
        name=pokemon_in.name,
        type="Normal",
        sprite_url=pokemon_in.sprite_url or "",
        hp=pokemon_in.hp,
        attack=pokemon_in.attack,
        defense=pokemon_in.defense,
        speed=pokemon_in.speed,
    )

    normal_type = (
        db.query(Type)
        .filter(Type.name == "Normal")
        .first()
    )

    if normal_type is None:
        normal_type = Type(name="Normal")
        db.add(normal_type)

    pokemon.types.append(normal_type)

    db.add(pokemon)
    db.commit()
    db.refresh(pokemon)

    return pokemon

