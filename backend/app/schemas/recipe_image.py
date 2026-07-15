from pydantic import BaseModel


class RecipeImageCreate(BaseModel):
    url: str


class RecipeImageResponse(BaseModel):
    id: int
    url: str
    recipe_id: int

    class Config:
        from_attributes = True
