import "../styles/Recipes.css";
import RecipeCard from "../components/RecipeCard";
import AddRecipeModal from "../components/AddRecipeModal";
import { useState } from "react";

function Recipes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>Recipes</h1>
        <button
          className="new-recipe-button"
          onClick={() => setIsModalOpen(true)}
        >
          + New Recipe
        </button>
      </div>

      <div className="recipes-search">
        <input type="text" placeholder="Search recipes..." />
      </div>

      <div className="recipe-list">
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>

      {isModalOpen && <AddRecipeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Recipes;
