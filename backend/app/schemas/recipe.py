from datetime import datetime
from pydantic import BaseModel


class RecipeCreate(BaseModel):
    title: str
    description: str | None = None
    instructions: str
    category_id: int


class RecipeUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    instructions: str | None = None
    category_id: int | None = None


class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str | None
    instructions: str
    category_id: int
    category_name: str
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True
