import sys

from sqlalchemy.orm import Session

from app.database import Base, engine
from app.services.pokemon_sync import sync_pokemons


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 20

    Base.metadata.create_all(bind=engine)

    with Session(engine) as db:
        result = sync_pokemons(db, count)

    print("Synchronisation terminée.")
    print(f"Importés : {result['imported']}")
    print(f"Mis à jour : {result['updated']}")
    print(f"Erreurs : {result['errors']}")


if __name__ == "__main__":
    main()