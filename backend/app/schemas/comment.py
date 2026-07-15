from datetime import datetime
from pydantic import BaseModel


class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    user_id: int
    recipe_id: int

    class Config:
        from_attributes: True
