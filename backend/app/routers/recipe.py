from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.crud import recipe as crud
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.post("/", response_model=RecipeResponse)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_recipe = crud.create_recipe(db=db, recipe=recipe, user_id=current_user.id)

    if not new_recipe:
        raise HTTPException(status_code=400, detail="Category does not exist")

    return new_recipe


@router.get("/", response_model=list[RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return crud.get_recipes(db)


@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = crud.get_recipe(db, recipe_id)

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return recipe


@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = crud.update_recipe(
        db=db, recipe_id=recipe_id, recipe_update=recipe_update, user_id=current_user.id
    )

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found, not owner, or category does not exist",
        )

    return recipe


@router.delete("/{recipe_id}", response_model=RecipeResponse)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = crud.delete_recipe(db=db, recipe_id=recipe_id, user_id=current_user.id)

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found or not owner")

    return recipe
