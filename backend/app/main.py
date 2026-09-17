from fastapi import FastAPI, Depends
from FastAPI.achievement import Achievement
from FastAPI.UserAchievement import UserAchievement
from database import Base, engine
from sqlalchemy.orm import Session

from backend.app.models.user import User
from backend.app.security import hash_password
from backend.app.schemas.user_schemas import UserCreate, UserResponse
from backend.app.database import get_db


app = FastAPI()

Base.metadata.create_all(bind=engine)
 

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    hash = hash_password(user.password)
    new_user = User(
        username = user.username,
        email = user.email,
        hashed_password = hash
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
