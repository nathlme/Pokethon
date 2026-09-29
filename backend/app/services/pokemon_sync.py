import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from sqlalchemy.orm import Session

from app.models.pokemons import Pokemon
from app.models.type import Type


TYPES = {
    "normal": "Normal",
    "fire": "Feu",
    "water": "Eau",
    "electric": "Foudre",
    "grass": "Plante",
    "ice": "Glace",
    "fighting": "Combat",
    "poison": "Poison",
    "ground": "Sol",
    "flying": "Vol",
    "psychic": "Psy",
    "bug": "Insecte",
    "rock": "Roche",
    "ghost": "Spectre",
    "dragon": "Dragon",
    "dark": "Ténèbres",
    "steel": "Acier",
    "fairy": "Fée",
}


def fetch_pokemon(number: int):
    url = f"https://pokeapi.co/api/v2/pokemon/{number}"

    request = Request(
        url,
        headers={
            "User-Agent": "PokethonStudentProject/1.0",
            "Accept": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)

    except HTTPError as error:
        print(f"Erreur HTTP pour le Pokémon {number} : {error.code}")
        return None

    except URLError as error:
        print(f"PokéAPI inaccessible pour le Pokémon {number} : {error.reason}")
        return None

    except TimeoutError:
        print(f"Timeout pour le Pokémon {number}")
        return None



def sync_pokemons(db: Session, count: int = 20):

    if not 1 <= count <= 1025:
        raise ValueError("Choisir entre 1 et 1025 Pokémon")

    imported = 0
    updated = 0
    errors = 0

    for number in range(1, count + 1):

        data = fetch_pokemon(number)

        if data is None:
            errors += 1
            continue

        stats = {
            stat["stat"]["name"]: stat["base_stat"]
            for stat in data["stats"]
        }

        pokemon = (
            db.query(Pokemon)
            .filter(Pokemon.id == data["id"])
            .first()
        )

        if pokemon is None:
            pokemon = Pokemon(
                id=data["id"],
                name=data["name"].capitalize(),
                type=TYPES[data["types"][0]["type"]["name"]],
                sprite_url=data["sprites"]["front_default"] or "",
                hp=stats["hp"],
                attack=stats["attack"],
                defense=stats["defense"],
                speed=stats["speed"],
            )

            db.add(pokemon)
            imported += 1

        else:
            pokemon.name = data["name"].capitalize()
            pokemon.type = TYPES[data["types"][0]["type"]["name"]]
            pokemon.sprite_url = data["sprites"]["front_default"] or ""
            pokemon.hp = stats["hp"]
            pokemon.attack = stats["attack"]
            pokemon.defense = stats["defense"]
            pokemon.speed = stats["speed"]

            updated += 1

        pokemon.types.clear()

        for type_data in data["types"]:
            english_name = type_data["type"]["name"]
            french_name = TYPES[english_name]

            pokemon_type = (
                db.query(Type)
                .filter(Type.name == french_name)
                .first()
            )

            if pokemon_type is None:
                pokemon_type = Type(name=french_name)
                db.add(pokemon_type)

            pokemon.types.append(pokemon_type)

    db.commit()

    return {
        "imported": imported,
        "updated": updated,
        "errors": errors,
    }