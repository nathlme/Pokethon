from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.main import get_current_user
from app.models.capture import Capture
from app.models.trade import Trade
from app.models.user import User
from app.schemas.trade import TradeCreate, TradeRead


router = APIRouter(
    prefix="/trades",
    tags=["trades"]
)


@router.post("/", response_model=TradeRead, status_code=201)
def create_trade(
    trade: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # You cannot create a trade with yourself
    if trade.to_user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot trade with yourself"
        )

    # Check that the target user exists
    target_user = db.query(User).filter(
        User.id == trade.to_user_id
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="Target user not found"
        )

    # Check offered capture
    offered_capture = db.query(Capture).filter(
        Capture.id == trade.offered_capture_id
    ).first()

    if not offered_capture:
        raise HTTPException(
            status_code=404,
            detail="Offered capture not found"
        )

    if offered_capture.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="The offered capture does not belong to you"
        )

    # Check requested capture
    requested_capture = db.query(Capture).filter(
        Capture.id == trade.requested_capture_id
    ).first()

    if not requested_capture:
        raise HTTPException(
            status_code=404,
            detail="Requested capture not found"
        )

    if requested_capture.user_id != trade.to_user_id:
        raise HTTPException(
            status_code=400,
            detail="The requested capture does not belong to the target user"
        )

    new_trade = Trade(
        from_user_id=current_user.id,
        to_user_id=trade.to_user_id,
        offered_capture_id=trade.offered_capture_id,
        requested_capture_id=trade.requested_capture_id,
        status="pending"
    )

    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)

    return new_trade


@router.get("/me", response_model=list[TradeRead])
def get_my_trades(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trades = db.query(Trade).filter(
        or_(
            Trade.from_user_id == current_user.id,
            Trade.to_user_id == current_user.id
        )
    ).all()

    return trades