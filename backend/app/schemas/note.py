from pydantic import BaseModel


class NoteCreate(BaseModel):
    capture_id: int
    content: str


class NoteUpdate(BaseModel):
    content: str


class NoteRead(BaseModel):
    id: int
    capture_id: int
    content: str

    class Config:
        orm_mode = True