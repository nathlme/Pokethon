import json
import sys
from urllib.request import urlopen

from sqlalchemy.orm import Session

from app.database import Base, engine
from app.models.pokemons import Pokemon


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

    with urlopen(url, timeout=20) as response:
        return json.load(response)


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 20

    if not 1 <= count <= 1025:
        raise ValueError("Choisir entre 1 et 1025 Pokémon")

    Base.metadata.create_all(bind=engine)

    with Session(engine) as db:
        for number in range(1, count + 1):

            if db.get(Pokemon, number) is not None:
                continue

            data = fetch_pokemon(number)

            stats = {
                stat["stat"]["name"]: stat["base_stat"]
                for stat in data["stats"]
            }

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

            print(f"{number}/{count} : {data['name']}")

        db.commit()

    print("Import terminé.")


if __name__ == "__main__":
    main()