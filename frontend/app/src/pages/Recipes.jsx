import "../styles/Recipes.css";
import RecipeCard from "../components/RecipeCard";
import AddRecipeModal from "../components/AddRecipeModal";
import { useState, useEffect } from "react";
import { API_URL } from "../api/api.js";

function Recipes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      const response = await fetch(`${API_URL}/recipes/`);
      const data = await response.json();

      setRecipes(data);
    }
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = search.toLowerCase();

    return (
      recipe.title.toLowerCase().includes(searchText) ||
      recipe.category_name.toLowerCase().includes(searchText)
    );
  });

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
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {isModalOpen && <AddRecipeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Recipes;
