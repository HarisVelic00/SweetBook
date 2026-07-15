from sqlalchemy.orm import Session
from app.models.rating import Rating
from app.schemas.rating import RatingsCreate, RatingUpdate


def create_rating(db: Session, rating: RatingsCreate, user_id: int):
    db_rating = Rating(value=rating.value, user_id=user_id, recipe_id=rating.recipe_id)

    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)

    return db_rating


def get_recipe_ratings(db: Session, recipe_id: int):
    return db.query(Rating).filter(Rating.recipe_id == recipe_id).all()


def get_user_ratings(db: Session, user_id: int):
    return db.query(Rating).filter(Rating.user_id == user_id).all()


def get_rating(db: Session, user_id: int, recipe_id: int):
    return (
        db.query(Rating)
        .filter(Rating.user_id == user_id, Rating.recipe_id == recipe_id)
        .first()
    )


def update_rating(db: Session, user_id: int, recipe_id: int, rating: RatingUpdate):

    db_rating = get_rating(db, user_id, recipe_id)

    if db_rating is None:
        return None

    db_rating.value = rating.value

    db.commit()
    db.refresh(db_rating)

    return db_rating


def delete_rating(db: Session, user_id: int, recipe_id: int):
    db_rating = get_rating(db, user_id, recipe_id)

    if db_rating is None:
        return None

    db.delete(db_rating)
    db.commit()

    return db_rating
