from pydantic import BaseModel


class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    quantity: str | None = None


class RecipeIngredientUpdate(BaseModel):
    quantity: str | None = None


class RecipeIngredientResponse(BaseModel):
    id: int
    recipe_id: int
    ingredient_id: int
    ingredient_name: str
    quantity: str | None = None

    class Config:
        from_attributes = True
