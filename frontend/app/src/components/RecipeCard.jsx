import "../components/RecipeCard.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/api";
import { useState, useEffect } from "react";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    async function fetchFavoriteCount() {
      try {
        const response = await fetch(
          `${API_URL}/favorites/recipe/${recipe.id}/count`,
        );

        const data = await response.json();

        setFavoriteCount(data);
      } catch (error) {
        console.error("Failed to fetch favorite count:", error);
      }
    }

    async function fetchRating() {
      try {
        const response = await fetch(
          `${API_URL}/rating/recipe/${recipe.id}/average`,
        );
        const data = await response.json();
        setAverageRating(data.average);
        setRatingCount(data.count);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    }

    fetchRating();
    fetchFavoriteCount();
  }, [recipe.id]);

  return (
    <div
      className="recipe-card"
      onClick={() =>
        navigate(`/home/recipes/${recipe.id}`, { state: { from: "recipes" } })
      }
    >
      {recipe.images.length > 0 ? (
        <img
          src={`${API_URL}${recipe.images[0].url}`}
          alt={recipe.title}
          className="recipe-card-image"
        />
      ) : (
        <div className="recipe-card-image-placeholder">No image available</div>
      )}

      <div className="recipe-card-header">
        <h2>{recipe.title}</h2>
        <p className="recipe-category">{recipe.category_name}</p>
      </div>

      <div className="recipe-card-body">
        <p className="recipe-description">{recipe.description}</p>
      </div>

      <div className="recipe-card-footer">
        <span>
          ⭐ {averageRating} ({ratingCount})
        </span>
        <span>❤️ {favoriteCount}</span>
      </div>
    </div>
  );
}

export default RecipeCard;
