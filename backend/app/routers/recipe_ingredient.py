from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.recipe import Recipe
from app.schemas.recipe_ingredient import (
    RecipeIngredientCreate,
    RecipeIngredientUpdate,
    RecipeIngredientResponse,
)
from app.crud import recipe as recipe_crud
from app.crud import recipe_ingredient as crud

router = APIRouter(tags=["Recipe Ingredients"])


@router.post(
    "/recipes/{recipe_id}/ingredients", response_model=RecipeIngredientResponse
)
def add_ingredient_to_recipe(
    recipe_id: int,
    ingredient: RecipeIngredientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = recipe_crud.get_recipe_by_id(db, recipe_id)

    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")

    if recipe.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this recipe."
        )

    try:
        return crud.add_ingredient_to_recipe(db, recipe_id, ingredient)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400, detail="Ingredient already exists in this recipe."
        )


@router.get(
    "/recipes/{recipe_id}/ingredients", response_model=list[RecipeIngredientResponse]
)
def get_recipe_ingredients(recipe_id: int, db: Session = Depends(get_db)):
    return crud.get_recipe_ingredients(db, recipe_id)


@router.put(
    "/recipe-ingredients/{recipe_ingredient_id}",
    response_model=RecipeIngredientResponse,
)
def update_recipe_ingredient(
    recipe_ingredient_id: int,
    ingredient: RecipeIngredientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_recipe_ingredient = crud.get_recipe_ingredient_by_id(db, recipe_ingredient_id)

    if db_recipe_ingredient is None:
        raise HTTPException(status_code=404, detail="Recipe ingredient not found")

    if db_recipe_ingredient.recipe.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this recipe."
        )

    return crud.update_recipe_ingredient(db, recipe_ingredient_id, ingredient)


@router.delete(
    "/recipe-ingredients/{recipe_ingredient_id}",
    response_model=RecipeIngredientResponse,
)
def delete_recipe_ingredient(
    recipe_ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    db_recipe_ingredient = crud.get_recipe_ingredient_by_id(db, recipe_ingredient_id)

    if db_recipe_ingredient is None:
        raise HTTPException(status_code=404, detail="Recipe ingredient not found")

    if db_recipe_ingredient.recipe.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this recipe."
        )

    return crud.delete_recipe_ingredient(db, recipe_ingredient_id)
