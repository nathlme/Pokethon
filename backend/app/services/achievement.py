from sqlalchemy.orm import Session
from .models import Achievement, UserAchievement 
from app.models.team import Team
from app.models.capture import Capture
from app.models.UserAchievement import UserAchievement
from app.models.pokemons import Pokemon

TEAM_FULL_SIZE = 6


def _count_captures(db: Session, user_id: int) -> int:
    return db.query(Capture).filter(Capture.user_id == user_id).count()


def _distinct_captured_pokemon_ids(db: Session, user_id: int) -> set[int]:
    """Espèces distinctes déjà capturées par l'utilisateur (les doublons ne comptent qu'une fois)."""
    rows = (
        db.query(Capture.pokemon_id)
        .filter(Capture.user_id == user_id)
        .distinct()
        .all()
    )
    return {r[0] for r in rows}


def _has_full_team(db: Session, user_id: int) -> bool:
    team = db.query(Team).filter(Team.user_id == user_id).first()
    if not team:
        return False

    filled_positions = {slot.position for slot in team.slots}
    return len(filled_positions) >= TEAM_FULL_SIZE


def _all_pokemon_ids_of_type(db: Session, type_name: str) -> set[int]:
    rows = (
        db.query(Pokemon.id)
        .filter((Pokemon.type1 == type_name) | (Pokemon.type2 == type_name))
        .all()
    )
    return {r[0] for r in rows}


def _already_unlocked_ids(db: Session, user_id: int) -> set[int]:
    rows = (
        db.query(UserAchievement.achievement_id)
        .filter(UserAchievement.user_id == user_id)
        .all()
    )
    return {r[0] for r in rows}


def check_achievements(user_id: int, db: Session) -> list[Achievement]:
    """À appeler après chaque capture/trade. Retourne les badges nouvellement débloqués."""

    unlocked_ids = _already_unlocked_ids(db, user_id)
    newly_unlocked: list[Achievement] = []

    all_achievements = db.query(Achievement).all()

    capture_count = _count_captures(db, user_id)
    full_team = _has_full_team(db, user_id)
    distinct_captured_ids = _distinct_captured_pokemon_ids(db, user_id)
    distinct_count = len(distinct_captured_ids)

    for achievement in all_achievements:
        if achievement.id in unlocked_ids:
            continue  # déjà débloqué, rien à faire

        earned = False

        # --- règles par code ---
        if achievement.code.startswith("collector_"):
            # ex: code "collector_10", threshold = 10 → seuil de captures (total, doublons inclus)
            if achievement.threshold is not None and capture_count >= achievement.threshold:
                earned = True

        elif achievement.code.startswith("discovery_"):
            # ex: code "discovery_50", threshold = 50 → 50 espèces DISTINCTES découvertes
            if achievement.threshold is not None and distinct_count >= achievement.threshold:
                earned = True

        elif achievement.code == "strategist":  # « Stratège » : équipe complète de 6
            if full_team:
                earned = True

        elif achievement.code.startswith("type_"):
            # ex: code "type_fire" → toutes les espèces de type Feu ont été capturées
            type_name = achievement.code.removeprefix("type_")
            all_ids = _all_pokemon_ids_of_type(db, type_name)
            if all_ids and all_ids.issubset(distinct_captured_ids):
                earned = True

        

        if earned:
            user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id,
            )
            db.add(user_achievement)
            newly_unlocked.append(achievement)

    if newly_unlocked:
        db.commit()

    return newly_unlocked