from datetime import datetime
from pydantic import BaseModel, Field


class RatingsCreate(BaseModel):
    value: int = Field(ge=1, le=5)
    recipe_id: int


class RatingUpdate(BaseModel):
    value: int = Field(ge=1, le=5)


class RatingResponse(BaseModel):
    id: int
    value: int
    user_id: int
    recipe_id: int
    created_at: datetime

    class Config:
        from_attributes = True
