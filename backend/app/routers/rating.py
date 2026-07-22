from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.rating import RatingsCreate, RatingResponse, RatingUpdate
from app.crud import rating as crud

router = APIRouter(prefix="/rating", tags=["Ratings"])


@router.post("/", response_model=RatingResponse)
def create_rating(
    rating: RatingsCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    try:
        db_rating = crud.create_rating(db=db, rating=rating, user_id=current_user.id)
        return db_rating

    except IntegrityError:
        db.rollback()

    raise HTTPException(status_code=400, detail="You already rated this recipe")


@router.get("/me", response_model=list[RatingResponse])
def get_my_ratings(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return crud.get_user_ratings(db=db, user_id=current_user.id)


@router.get("/recipe/{recipe_id}/average")
def get_average_rating(recipe_id: int, db: Session = Depends(get_db)):
    return crud.get_recipe_average(db=db, recipe_id=recipe_id)


@router.get("/recipe/{recipe_id}/me", response_model=RatingResponse | None)
def get_my_recipe_rating(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_user_recipe_rating(
        db=db, user_id=current_user.id, recipe_id=recipe_id
    )


@router.put("/{recipe_id}", response_model=RatingResponse)
def update_rating(
    recipe_id: int,
    rating: RatingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    db_rating = crud.update_rating(
        db=db, user_id=current_user.id, recipe_id=recipe_id, rating=rating
    )

    if db_rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")

    return db_rating


@router.delete("/{recipe_id}", response_model=RatingResponse)
def delete_rating(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    db_rating = crud.delete_rating(db=db, user_id=current_user.id, recipe_id=recipe_id)

    if db_rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")

    return db_rating
