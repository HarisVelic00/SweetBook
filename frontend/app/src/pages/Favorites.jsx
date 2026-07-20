import "../styles/Favorites.css";
import UserRecipeCard from "../components/UserRecipeCard";
import { API_URL } from "../api/api.js";
import { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/favorites/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("FAVORITES RESPONSE:", data);

        setFavorites(data);

        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your favorites</h1>
      </div>

      <div className="favorites-search">
        <input type="text" placeholder="Search favorite recipes..." />
      </div>

      <div className="favorites-list"></div>

      {Array.isArray(favorites) && favorites.length > 0 ? (
        favorites.map((favorite) => (
          <UserRecipeCard
            key={favorite.id}
            recipeId={favorite.recipe.id}
            title={favorite.recipe.title}
            category={favorite.recipe.category_name}
            extra="❤️ Favorite"
            from="favorites"
          />
        ))
      ) : (
        <p>You have no favorite recipes.</p>
      )}
    </div>
  );
}

export default Favorites;
