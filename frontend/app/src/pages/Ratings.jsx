import "../styles/Ratings.css";
import UserRecipeCard from "../components/UserRecipeCard";
import { API_URL } from "../api/api.js";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";

function Ratings() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/rating/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("RATINGS RESPONSE:", data);

        const recipes = await Promise.all(
          data.map(async (rating) => {
            const recipeResponse = await fetch(
              `${API_URL}/recipes/${rating.recipe_id}`,
            );
            const recipe = await recipeResponse.json();
            return { ...rating, recipe };
          }),
        );

        setRatings(recipes);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    }
    fetchRatings();
  }, []);

  return (
    <div className="ratings-page">
      <div className="ratings-header">
        <h1>Your ratings</h1>
      </div>

      <div className="ratings-search">
        <input type="text" placeholder="Search rated recipes..." />
      </div>

      <div className="ratings-list">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <UserRecipeCard
              key={rating.id}
              recipeId={rating.recipe.id}
              title={rating.recipe.title}
              category={rating.recipe.category_name}
              extra={`⭐ Your Ratings: ${rating.value}/5`}
              from="ratings"
            />
          ))
        ) : (
          <p>You haven't rated any recipes yet.</p>
        )}
      </div>
    </div>
  );
}

export default Ratings;
