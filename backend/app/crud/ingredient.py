from sqlalchemy.orm import Session
from app.models.ingredient import Ingredient
from app.schemas.ingredient import IngredientCreate, IngredientUpdate


def create_ingredient(db: Session, ingredient: IngredientCreate):
    db_ingredient = Ingredient(name=ingredient.name)

    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)

    return db_ingredient


def get_ingredients(db: Session):
    return db.query(Ingredient).all()


def get_ingredient_by_id(db: Session, ingredient_id: int):
    return db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()


def update_ingredient(db: Session, ingredient_id: int, ingredient: IngredientUpdate):
    db_ingredient = get_ingredient_by_id(db, ingredient_id)

    if db_ingredient is None:
        return None

    db_ingredient.name = ingredient.name

    db.commit()
    db.refresh(db_ingredient)

    return db_ingredient


def delete_ingredient(db: Session, ingredient_id: int):
    db_ingredient = get_ingredient_by_id(db, ingredient_id)

    if db_ingredient is None:
        return None

    db.delete(db_ingredient)
    db.commit()

    return db_ingredient
