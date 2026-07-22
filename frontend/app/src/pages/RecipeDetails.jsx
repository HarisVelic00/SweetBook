import "../styles/RecipeDetails.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useTransition } from "react";
import { API_URL } from "../api/api.js";
import DeleteRecipeModal from "../components/DeleteRecipeModal.jsx";

function RecipeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const location = useLocation();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingsCount] = useState(0);
  const token = localStorage.getItem("token");
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      const response = await fetch(`${API_URL}/recipes/${id}`);
      const data = await response.json();

      setRecipe(data);
    }

    async function fetchFavoriteCount() {
      const response = await fetch(`${API_URL}/favorites/recipe/${id}/count`);
      const data = await response.json();

      console.log("Favorite count:", data);

      setFavoriteCount(data);
    }

    async function fetchComments() {
      try {
        const response = await fetch(`${API_URL}/comments/recipes/${id}`);
        const data = await response.json();

        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }

    async function checkFavoriteStatus() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/favorites/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Favorites:", data);

        const exists = data.some(
          (favorite) => favorite.recipe_id === Number(id),
        );

        setIsFavorite(exists);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchMyRatings() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/rating/recipe/${id}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setUserRating(0);
          return;
        }

        const data = await response.json();
        setUserRating(data ? data.value : 0);
      } catch (error) {
        console.error("Failed to fetch user rating:", error);
      }
    }

    async function fetchAverageRating() {
      try {
        const response = await fetch(`${API_URL}/rating/recipe/${id}/average`);

        const data = await response.json();

        setAverageRating(data.average);
        setRatingsCount(data.count);
      } catch (error) {
        console.error("Failed to fetch average rating:", error);
      }
    }

    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(payload);
    }

    fetchComments();
    fetchFavoriteCount();
    fetchRecipe();
    checkFavoriteStatus();
    fetchMyRatings();
    fetchAverageRating();
  }, [id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  async function toggleFavorite() {
    const token = localStorage.getItem("token");

    try {
      if (isFavorite) {
        console.log("Removing favorite recipe:", id);

        const response = await fetch(`${API_URL}/favorites/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.log(error);
          return;
        }

        setIsFavorite(false);

        setFavoriteCount((prev) => Math.max(0, prev - 1));
      } else {
        console.log("Adding favorite recipe:", id);

        const response = await fetch(`${API_URL}/favorites/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipe_id: Number(id),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.log(error);
          return;
        }

        setIsFavorite(true);

        setFavoriteCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  }

  async function addComment() {
    if (!commentText.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/comments/recipes/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentText,
        }),
      });

      const newComment = await response.json();

      setComments((prev) => [...prev, newComment]);

      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  }

  async function deleteComment(commentId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete comment");
        return;
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  }

  async function rateRecipe(value) {
    try {
      let response;

      if (!userRating) {
        response = await fetch(`${API_URL}/rating/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            value: value,
            recipe_id: Number(id),
          }),
        });
      } else {
        response = await fetch(`${API_URL}/rating/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            value: value,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        console.log("Rating backend error:", error);
        throw new Error("Failed to rate");
      }

      setUserRating(value);

      const averageResponse = await fetch(
        `${API_URL}/rating/recipe/${id}/average`,
      );

      const averageData = await averageResponse.json();

      setAverageRating(averageData.average);
      setRatingsCount(averageData.count);
    } catch (error) {
      console.error("Rating error:", error);
    }
  }

  async function deleteRecipe() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/recipes/${recipe.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response:", response.status);

      if (!response.ok) {
        console.log("Delete failed");
        return;
      }

      console.log("Delete successful");

      setShowDeleteModal(false);

      navigate("/home/recipes");
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  return (
    <div className="recipe-details">
      <button
        className="back-button"
        onClick={() => {
          if (location.state?.from === "favorites") {
            navigate("/home/favorites");
          } else if (location.state?.from === "ratings") {
            navigate("/home/ratings");
          } else {
            navigate("/home/recipes");
          }
        }}
      >
        ← Back
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

      {Number(currentUser?.sub) === recipe.user_id && (
        <div className="recipe-actions">
          <button
            className="edit-recipe-button"
            onClick={() => navigate(`/home/recipes/${id}/edit`)}
          >
            ✏️ Edit Recipe
          </button>

          <button
            className="delete-recipe-button"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑 Delete Recipe
          </button>
        </div>
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

        <div className="section-content rating-content">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="star"
                onClick={() => rateRecipe(star)}
              >
                {star <= userRating ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <div className="rating-count">
            Community rating: ⭐ {averageRating} ({ratingCount} ratings)
          </div>
        </div>
      </div>
      <div className="recipe-section">
        <h2>Favorites</h2>

        <div className="section-content favorite-content">
          <div className="favorite-count">
            ❤️ {favoriteCount} people saved this recipe
          </div>

          <button className="favorite-button" onClick={toggleFavorite}>
            {isFavorite ? "♥ Remove from favorites" : "♡ Add to favorites"}
          </button>
        </div>
      </div>
      <div className="recipe-section">
        <h2>Leave a Comment</h2>

        <textarea
          className="comment-input"
          placeholder="Write your comment..."
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <button className="comment-button" onClick={addComment}>
          Post Comment
        </button>
      </div>
      <div className="recipe-section">
        <h2>Comments</h2>

        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="comment-header">
              <strong>{comment.user.username}</strong>

              {Number(currentUser?.sub) === comment.user_id && (
                <button
                  className="delete-comment"
                  onClick={() => deleteComment(comment.id)}
                >
                  🗑️
                </button>
              )}
            </div>

            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <DeleteRecipeModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteRecipe}
        />
      )}
    </div>
  );
}

export default RecipeDetails;
