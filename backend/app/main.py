from fastapi import FastAPI
from app.database import Base, engine
from app import models

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Pokethon API is running"}

# Crée les tables au démarrage