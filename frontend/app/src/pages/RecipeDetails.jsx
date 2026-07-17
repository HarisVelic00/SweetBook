import "../styles/RecipeDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../api/api.js";

function RecipeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      const data = await response.json();

      setRecipe(data);
    }

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className="recipe-details">
      <button className="back-button" onClick={() => navigate("/home/recipes")}>
        ← Back to Recipes
      </button>
      <div className="recipe-details-header">
        <h1>{recipe.title}</h1>
        <p>{recipe.category_name}</p>
      </div>

      {recipe.images.length > 0 ? (
        <img
          src={`${API_URL}${recipe.images[0].url}`}
          alt={recipe.title}
          className="recipe-image"
        />
      ) : (
        <div className="recipe-image">No image available</div>
      )}

      <div className="recipe-section">
        <h2>Description</h2>
        <p>{recipe.description}</p>
      </div>

      <div className="recipe-section">
        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
      </div>

      <div className="recipe-section">
        <h2>Ingredients</h2>
        {recipe.ingredients.length === 0 ? (
          <p>No ingredients added yet.</p>
        ) : (
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.quantity} {ingredient.ingredient_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="recipe-section">
        <h2>Your Rating</h2>

        <div className="rating-stars">
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>☆</span>
        </div>
      </div>

      <div className="recipe-section">
        <h2>Leave a Comment</h2>

        <textarea
          className="comment-input"
          placeholder="Write your comment..."
          rows="4"
        />

        <button className="comment-button">Post Comment</button>
      </div>

      <div className="recipe-section">
        <h2>Comments</h2>

        <div className="comment">
          <strong>John</strong>
          <p>Great recipe! Easy to follow.</p>
        </div>

        <div className="comment">
          <strong>Sarah</strong>
          <p>I tried this and it was delicious.</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
