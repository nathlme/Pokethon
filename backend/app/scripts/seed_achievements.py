"""
Script à lancer une fois (ou à chaque déploiement, il est idempotent) pour
créer les Achievement manquants : paliers de découverte + un badge par type.
Usage : python -m app.scripts.seed_achievements
"""

from sqlalchemy.orm import Session
from app.models.achievement import Achievement
from app.models.type import Type
from ..database import SessionLocal


DISCOVERY_THRESHOLDS = [5, 10, 20, 50, 100, 151]

DISCOVERY_LABELS = {
    5: ("Premiers pas", "Découvrir 5 Pokémon différents"),
    10: ("Apprenti Dresseur", "Découvrir 10 Pokémon différents"),
    20: ("Collectionneur", "Découvrir 20 Pokémon différents"),
    50: ("Expert Pokédex", "Découvrir 50 Pokémon différents"),
    100: ("Maître Pokédex", "Découvrir 100 Pokémon différents"),
    151: ("Champion de Kanto", "Découvrir les 151 Pokémon de Kanto"),
}



def _get_or_create(db: Session, code: str, label: str, description: str, threshold: int | None):
    existing = db.query(Achievement).filter(Achievement.code == code).first()
    if existing:
        return existing
    achievement = Achievement(code=code, label=label, description=description, threshold=threshold)
    db.add(achievement)
    return achievement


def seed_discovery_achievements(db: Session) -> None:
    for threshold in DISCOVERY_THRESHOLDS:
        label, description = DISCOVERY_LABELS[threshold]
        _get_or_create(
            db,
            code=f"discovery_{threshold}",
            label=label,
            description=description,
            threshold=threshold,
        )


def seed_type_achievements(db: Session) -> None:
    type1_values = {t for (t,) in db.query(Pokemon.type1).distinct() if t}
    type2_values = {t for (t,) in db.query(Pokemon.type2).distinct() if t}
    all_types = sorted(type1_values | type2_values)

    for type_name in all_types:
       for (type_name,) in db.query(Type.name).order_by(Type.name):
        _get_or_create(
            db,
            code=f"type_{type_name}",
            label=f"Maître {type_name}",
            description=f"Capturer tous les Pokémon de type {type_name}",
            threshold=None,  
        )


def run():
    db = SessionLocal()
    try:
        seed_discovery_achievements(db)
        seed_type_achievements(db)
        db.commit()
        print("Achievements seedés avec succès.")
    finally:
        db.close()


if __name__ == "__main__":
    run()