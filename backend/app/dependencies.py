from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token expiré ou invalide")

    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalide")

    current_user = db.query(User).filter(User.id == user_id).first()

    if not current_user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    return current_user