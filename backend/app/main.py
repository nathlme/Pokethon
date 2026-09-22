from fastapi import FastAPI, Depends, HTTPException
from app.database import Base, engine
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.models.pokemons import Pokemon
from app.routers.pokemons import router as pokemon_router
from app.models.user import User
from app.security import hash_password, verify_password, create_access_token, decode_access_token
from app.schemas.user_schemas import UserCreate, UserResponse, UserLogin, TokenResponse
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pokemon_router)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

Base.metadata.create_all(bind=engine)
 
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)

    if not payload: 
        raise HTTPException(status_code=400, detail="Token expiré")

    user_id = int(payload["sub"])
    current_user = db.query(User).filter(User.id == user_id).first()

    if not current_user :
        raise HTTPException(status_code=404, detail="utilisateur introuvable")
    
    return current_user

    
@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
     
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user :
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username :
        raise HTTPException(status_code=400, detail="Pseudo déjà utilisé")

    
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


@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin , db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user : 
        password_valid = verify_password(user.password, existing_user.hashed_password)
    else : 
        raise HTTPException(status_code=404, detail="Email inexistant") 

    if not password_valid:
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    user_JWT = create_access_token(existing_user.id)

    token = TokenResponse(access_token=user_JWT, token_type="bearer")
    return token 

