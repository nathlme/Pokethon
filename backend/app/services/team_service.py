from collections import defaultdict
from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_slot import TeamSlot

def auto_generate_team(db: Session, team: Team, captures: list):
    db.query(TeamSlot).filter(TeamSlot.team_id == team.id).delete()

    captures_by_type = defaultdict(list)
    for capture in captures:
        for t in capture.pokemon.types:
            captures_by_type[t.name].append(capture)

    selected = []
    used_ids = set()

    for type_name, type_captures in captures_by_type.items():
        for capture in type_captures:
            if len(selected) >= 6:
                break
            if capture.id not in used_ids:
                selected.append(capture)
                used_ids.add(capture.id)
        if len(selected) >= 6:
            break

    if len(selected) < 6:
        for capture in captures:
            if len(selected) >= 6:
                break
            if capture.id not in used_ids:
                selected.append(capture)
                used_ids.add(capture.id)

    new_slots = []
    for position, capture in enumerate(selected, start=1):
        slot = TeamSlot(team_id=team.id, capture_id=capture.id, position=position)
        db.add(slot)
        new_slots.append(slot)

    db.commit()
    for slot in new_slots:
        db.refresh(slot)

    return new_slots