from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import verify_password, hash_password
from app.models.user import User
from app.schemas.user import UserChangePassword, UserResponse

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    username: str,
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.username = username
    current_user.email = email

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put("/me/password")
def change_password(
    data: UserChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    current_user.password_hash = hash_password(data.new_password)

    db.commit()
    db.refresh(current_user)

    return {"message": "Password updated successfully"}
