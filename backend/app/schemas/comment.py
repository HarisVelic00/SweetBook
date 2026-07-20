from datetime import datetime
from pydantic import BaseModel
from app.schemas.user import UserResponse

class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    text: str
    created_at: datetime
    user_id: int
    recipe_id: int
    user: CommentUser

    class Config:
        from_attributes: True


class CommentUser(BaseModel):
    username: str

    class Config:
        from_attributes = True