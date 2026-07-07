from sqlalchemy.orm import Session
from app.models.recipe import Recipe
from app.models.category import Category
from app.schemas.recipe import RecipeCreate, RecipeUpdate


def create_recipe(db: Session, recipe: RecipeCreate, user_id: int):
    category = db.query(Category).filter(Category.id == recipe.category_id).first()

    if not category:
        return None

    db_recipe = Recipe(
        title=recipe.title,
        description=recipe.description,
        instructions=recipe.instructions,
        category_id=recipe.category_id,
        image_url=recipe.image_url,
        user_id=user_id
    )

    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)

    return db_recipe


def get_recipes(db: Session):
    return db.query(Recipe).all()


def get_recipe(db: Session, recipe_id: int):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def update_recipe(
    db: Session,
    recipe_id: int,
    recipe_update: RecipeUpdate,
    user_id: int
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not recipe:
        return None

    if recipe.user_id != user_id:
        return None

    if recipe_update.category_id:
        category = db.query(Category).filter(Category.id == recipe_update.category_id).first()

        if not category:
            return None

    update_data = recipe_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(recipe, key, value)

    db.commit()
    db.refresh(recipe)

    return recipe


def delete_recipe(db: Session, recipe_id: int, user_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not recipe:
        return None

    if recipe.user_id != user_id:
        return None

    db.delete(recipe)
    db.commit()

    return recipe