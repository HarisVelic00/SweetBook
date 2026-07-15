from sqlalchemy.orm import Session
from app.models.recipe_image import RecipeImage
from app.schemas.recipe_image import RecipeImageCreate


def create_recipe_image(db: Session, recipe_id: int, image: RecipeImageCreate):

    db_image = RecipeImage(url=image.url, recipe_id=recipe_id)

    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image


def get_recipe_images(db: Session, recipe_id: int):
    return db.query(RecipeImage).filter(RecipeImage.recipe_id == recipe_id).all()


def get_image_by_id(db: Session, image_id: int):
    return db.query(RecipeImage).filter(RecipeImage.id == image_id).first()


def delete_recipe_image(db: Session, image_id: int):

    db_image = get_image_by_id(db, image_id)

    if db_image is None:
        return None

    db.delete(db_image)
    db.commit()

    return db_image
