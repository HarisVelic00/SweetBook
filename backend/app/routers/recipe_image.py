from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.recipe_image import RecipeImageCreate, RecipeImageResponse
from app.crud import recipe_image as crud
from app.crud import recipe as recipe_crud

router = APIRouter(tags=["Recipe Images"])


@router.post("/recipes/{recipe_id}/images", response_model=RecipeImageResponse)
def add_recipe_image(
    recipe_id: int,
    file: UploadFile = File(...),
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

    upload_folder = "uploads/recipes"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = f"{upload_folder}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_data = RecipeImageCreate(url=f"/{file_path}")

    return crud.create_recipe_image(db, recipe_id, image_data)


@router.get("/recipes/{recipe_id}/images", response_model=list[RecipeImageResponse])
def get_recipe_images(recipe_id: int, db: Session = Depends(get_db)):
    return crud.get_recipe_images(db, recipe_id)


@router.delete("/recipe-images/{image_id}", response_model=RecipeImageResponse)
def delete_recipe_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    image = crud.get_image_by_id(db, image_id)

    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")

    if image.recipe.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You are not the owner of this recipe."
        )

    return crud.delete_recipe_image(db, image_id)
