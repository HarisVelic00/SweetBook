from sqlalchemy.orm import Session, joinedload
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteCreate


def create_favorite(db: Session, favorite: FavoriteCreate, user_id: int):

    db_favorite = Favorite(user_id=user_id, recipe_id=favorite.recipe_id)

    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)

    return db_favorite


def get_user_favorites(db: Session, user_id: int):

    return (
        db.query(Favorite)
        .options(joinedload(Favorite.recipe))
        .filter(Favorite.user_id == user_id)
        .all()
    )


def get_favorite(db: Session, user_id: int, recipe_id: int):

    return (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id, Favorite.recipe_id == recipe_id)
        .first()
    )


def get_favorite_count(db: Session, recipe_id: int):
    return db.query(Favorite).filter(Favorite.recipe_id == recipe_id).count()


def delete_favorite(db: Session, user_id: int, recipe_id: int):

    db_favorite = get_favorite(db, user_id, recipe_id)

    if db_favorite is None:
        return None

    db.delete(db_favorite)
    db.commit()

    return db_favorite
