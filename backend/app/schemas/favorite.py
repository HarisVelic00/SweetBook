from datetime import datetime
from pydantic import BaseModel
from app.schemas.recipe import RecipeResponse


class FavoriteCreate(BaseModel):
    recipe_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    recipe: RecipeResponse

    class Config:
        from_attributes = True

class FavoriteDeleteResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime

    class Config:
        from_attributes = True