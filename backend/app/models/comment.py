from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func 
from app.core.database import Base


class Comment (Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)

    text = Column(String(500), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)