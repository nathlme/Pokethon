"""
Script à lancer une fois (ou à chaque déploiement, il est idempotent) pour
créer les Achievement manquants : paliers de découverte, paliers de collection,
badge Stratège et un badge par type.

Usage (depuis le dossier backend) : python -m app.scripts.seed_achievements
"""

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.achievement import Achievement
from app.models.type import Type


DISCOVERY_THRESHOLDS = [5, 10, 20, 50, 100, 151]

DISCOVERY_LABELS = {
    5: ("Premiers pas", "Découvrir 5 Pokémon différents"),
    10: ("Apprenti Dresseur", "Découvrir 10 Pokémon différents"),
    20: ("Collectionneur", "Découvrir 20 Pokémon différents"),
    50: ("Expert Pokédex", "Découvrir 50 Pokémon différents"),
    100: ("Maître Pokédex", "Découvrir 100 Pokémon différents"),
    151: ("Champion de Kanto", "Découvrir les 151 Pokémon de Kanto"),
}

COLLECTOR_THRESHOLDS = [10, 25, 50]


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


def seed_collector_achievements(db: Session) -> None:
    for threshold in COLLECTOR_THRESHOLDS:
        _get_or_create(
            db,
            code=f"collector_{threshold}",
            label=f"Chasseur {threshold}",
            description=f"Effectuer {threshold} captures (doublons inclus)",
            threshold=threshold,
        )


def seed_strategist_achievement(db: Session) -> None:
    _get_or_create(
        db,
        code="strategist",
        label="Stratège",
        description="Composer une équipe complète de 6 Pokémon",
        threshold=None,
    )


def seed_type_achievements(db: Session) -> None:
    for (type_name,) in db.query(Type.name).order_by(Type.name):
        _get_or_create(
            db,
            code=f"type_{type_name}",  # ex : type_Feu
            label=f"Maître {type_name}",
            description=f"Capturer tous les Pokémon de type {type_name}",
            threshold=None,
        )


def run():
    db = SessionLocal()
    try:
        seed_discovery_achievements(db)
        seed_collector_achievements(db)
        seed_strategist_achievement(db)
        seed_type_achievements(db)
        db.commit()
        print("Achievements seedés avec succès.")
    finally:
        db.close()


if __name__ == "__main__":
    run()