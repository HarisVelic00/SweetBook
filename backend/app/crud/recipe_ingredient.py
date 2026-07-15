from sqlalchemy.orm import Session
from app.models.recipe_ingredient import RecipeIngredient
from app.schemas.recipe_ingredient import RecipeIngredientCreate, RecipeIngredientUpdate


def add_ingredient_to_recipe(
    db: Session, recipe_id: int, ingredient: RecipeIngredientCreate
):
    db_recipe_ingredient = RecipeIngredient(
        recipe_id=recipe_id,
        ingredient_id=ingredient.ingredient_id,
        quantity=ingredient.quantity,
    )

    db.add(db_recipe_ingredient)
    db.commit()
    db.refresh(db_recipe_ingredient)

    return db_recipe_ingredient


def get_recipe_ingredients(db: Session, recipe_id: int):
    return (
        db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).all()
    )


def get_recipe_ingredient_by_id(db: Session, recipe_ingredient_id: int):
    return (
        db.query(RecipeIngredient)
        .filter(RecipeIngredient.id == recipe_ingredient_id)
        .first()
    )


def get_recipe_ingredient_with_recipe(db: Session, recipe_ingredient_id: int):
    return (
        db.query(RecipeIngredient)
        .filter(RecipeIngredient.id == recipe_ingredient_id)
        .first()
    )


def update_recipe_ingredient(
    db: Session, recipe_ingredient_id: int, ingredient: RecipeIngredientUpdate
):

    db_recipe_ingredient = get_recipe_ingredient_by_id(db, recipe_ingredient_id)

    if db_recipe_ingredient is None:
        return None

    db_recipe_ingredient.quantity = ingredient.quantity

    db.commit()
    db.refresh(db_recipe_ingredient)

    return db_recipe_ingredient


def delete_recipe_ingredient(db: Session, recipe_ingredient_id: int):

    db_recipe_ingredient = get_recipe_ingredient_by_id(db, recipe_ingredient_id)

    if db_recipe_ingredient is None:
        return None

    db.delete(db_recipe_ingredient)
    db.commit()

    return db_recipe_ingredient
