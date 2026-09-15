from fastapi import FastAPI
from FastAPI.achievement import Achievement
from FastAPI.UserAchievement import UserAchievement
from database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)