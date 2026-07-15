from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.favorite import FavoriteCreate, FavoriteResponse
from app.crud import favorite as crud

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.post("/", response_model=FavoriteResponse)
def create_favorite(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        db_favorite = crud.create_favorite(
            db=db, favorite=favorite, user_id=current_user.id
        )

        return db_favorite

    except IntegrityError:
        db.rollback()

        raise HTTPException(status_code=400, detail="Recipe already added to favorites")


@router.get("/", response_model=list[FavoriteResponse])
def get_my_favorites(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return crud.get_user_favorites(db=db, user_id=current_user.id)


@router.delete("/{recipe_id}", response_model=FavoriteResponse)
def delete_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    db_favorite = crud.delete_favorite(
        db=db, user_id=current_user.id, recipe_id=recipe_id
    )

    if db_favorite is None:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return db_favorite
