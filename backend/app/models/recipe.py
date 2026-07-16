from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    instructions = Column(Text, nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    images = relationship(
        "RecipeImage", back_populates="recipe", cascade="all, delete-orphan"
    )

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    owner = relationship("User", back_populates="recipes")

    category = relationship("Category", back_populates="recipes")

    favorites = relationship(
        "Favorite", back_populates="recipe", cascade="all, delete-orphan"
    )

    comments = relationship(
        "Comment", back_populates="recipe", cascade="all, delete-orphan"
    )

    ratings = relationship(
        "Rating", back_populates="recipe", cascade="all, delete-orphan"
    )

    ingredients = relationship(
        "RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan"
    )

    @property
    def category_name(self):
        return self.category.name
