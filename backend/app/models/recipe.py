from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column (String(255), nullable=False)

    description = Column(Text, nullable=True)

    instructions = Column(Text, nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    image_url = Column(String(500),nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="recipes")

    category = relationship("Category", back_populates="recipes")
                   