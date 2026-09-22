from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.main import get_current_user
from app.models.capture import Capture
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate, NoteRead


router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)


@router.post("/", response_model=NoteRead, status_code=201)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    capture = db.query(Capture).filter(Capture.id == note.capture_id).first()

    if not capture:
        raise HTTPException(
            status_code=404,
            detail="Capture not found"
        )

    if capture.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="This capture does not belong to you"
        )

    new_note = Note(
        capture_id=note.capture_id,
        content=note.content
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


@router.get("/{note_id}", response_model=NoteRead)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    capture = db.query(Capture).filter(Capture.id == note.capture_id).first()

    if not capture or capture.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this note"
        )

    return note


@router.put("/{note_id}", response_model=NoteRead)
def update_note(
    note_id: int,
    updated_note: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    capture = db.query(Capture).filter(Capture.id == note.capture_id).first()

    if not capture or capture.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot modify this note"
        )

    note.content = updated_note.content

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}", status_code=204)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    capture = db.query(Capture).filter(Capture.id == note.capture_id).first()

    if not capture or capture.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this note"
        )

    db.delete(note)
    db.commit()