from fastapi import FastAPI
from app.database import Base, engine
from app import models
from app.routers import team, team_slot

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(team.router)
app.include_router(team_slot.router)

@app.get("/")
def root():
    return {"message": "PokeThon API is running"}