from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/pokethon"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# C'est la partie connexion à la bd PostgreSQL avec SQLAlchemy, normalement ça prend en compte:
# l'URL de connexion à la bd, le moteur qui gère la connexion, la Base (avec tous les modèles (Team, User, etc.)),
# et get_db() utilisé par FastAPI pour gérer les sessions