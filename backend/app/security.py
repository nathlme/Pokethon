import jwt
import os
from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()

def hash_password(password: str): 
    return password_hash.hash(password)

def verify_password(password: str, hash: str):
    return password_hash.verify(password, hash)

def create_access_token(user_id: int):
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub" : str(user_id),
        "exp" : expiration
    }

    token = jwt.encode(payload,SECRET_KEY,ALGORITHM)

    return token 