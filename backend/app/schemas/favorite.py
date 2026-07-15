from datetime import datetime
from pydantic import BaseModel


class FavoriteCreate(BaseModel):
    recipe_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime

    class Config:
        from_attributes = True
