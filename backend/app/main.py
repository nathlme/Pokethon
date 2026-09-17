from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from schemas import UserCreate
from database import get_db


app = FastAPI()


@app.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return user