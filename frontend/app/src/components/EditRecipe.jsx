import "../components/EditRecipe.css";
import { useParams } from "react-router-dom";
import { API_URL } from "../api/api.js";
import { useState, useEffect } from "react";
import AddRecipeModal from "./AddRecipeModal.jsx";
import { useNavigate } from "react-router-dom";

function EditRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipe() {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      const data = await response.json();
      console.log(data);
      setRecipe(data);
    }
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <AddRecipeModal
      recipe={recipe}
      mode="edit"
      onClose={() => navigate(`/home/recipes/${id}`)}
      refreshRecipes={() => {}}
    />
  );
}

export default EditRecipe;
