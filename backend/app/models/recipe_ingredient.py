from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from sqlalchemy import UniqueConstraint


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)

    quantity = Column(String(100), nullable=True)

    recipe_id = Column(
        Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False
    )

    ingredient_id = Column(
        Integer, ForeignKey("ingredients.id", ondelete="CASCADE"), nullable=False
    )

    recipe = relationship("Recipe", back_populates="ingredients")

    ingredient = relationship("Ingredient", back_populates="recipes")

    __table_args__ = (
        UniqueConstraint("recipe_id", "ingredient_id", name="unique_recipe_ingredient"),
    )
