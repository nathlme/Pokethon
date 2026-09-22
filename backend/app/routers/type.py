from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.type import Type
from app.schemas.type import TypeCreate, TypeRead, TypeUpdate

router = APIRouter(prefix="/types", tags=["types"])


@router.get("/", response_model=list[TypeRead])
def list_types(db: Session = Depends(get_db)):
    return db.query(Type).all()


@router.post("/", response_model=TypeRead, status_code=status.HTTP_201_CREATED)
def create_type(payload: TypeCreate, db: Session = Depends(get_db)):
    if db.query(Type).filter(Type.name == payload.name).first():
        raise HTTPException(status_code=409, detail="Ce type existe déjà")
    type_obj = Type(**payload.model_dump())
    db.add(type_obj)
    db.commit()
    db.refresh(type_obj)
    return type_obj


@router.put("/{type_id}", response_model=TypeRead)
def update_type(type_id: int, payload: TypeUpdate, db: Session = Depends(get_db)):
    type_obj = db.query(Type).filter(Type.id == type_id).first()
    if not type_obj:
        raise HTTPException(status_code=404, detail="Type introuvable")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(type_obj, field, value)
    db.commit()
    db.refresh(type_obj)
    return type_obj


@router.delete("/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    type_obj = db.query(Type).filter(Type.id == type_id).first()
    if not type_obj:
        raise HTTPException(status_code=404, detail="Type introuvable")
    db.delete(type_obj)
    db.commit()