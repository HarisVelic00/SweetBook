from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.ingredient import (
    IngredientCreate,
    IngredientUpdate,
    IngredientResponse,
)
from app.crud import ingredient as crud

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])


@router.post("/", response_model=IngredientResponse)
def create_ingredient(ingredient: IngredientCreate, db: Session = Depends(get_db)):
    return crud.create_ingredient(db, ingredient)


@router.get("/", response_model=list[IngredientResponse])
def get_ingredients(db: Session = Depends(get_db)):
    return crud.get_ingredients(db)


@router.get("/{ingredient_id}", response_model=IngredientResponse)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    db_ingredient = crud.get_ingredient_by_id(db, ingredient_id)

    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return db_ingredient


@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(
    ingredient_id: int, ingredient: IngredientUpdate, db: Session = Depends(get_db)
):
    db_ingredient = crud.update_ingredient(db, ingredient_id, ingredient)

    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return db_ingredient


@router.delete("/{ingredient_id}", response_model=IngredientResponse)
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    db_ingredient = crud.delete_ingredient(db, ingredient_id)

    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return db_ingredient
