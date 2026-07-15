from pydantic import BaseModel


class IngredientCreate(BaseModel):
    name: str


class IngredientUpdate(BaseModel):
    name: str


class IngredientResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
