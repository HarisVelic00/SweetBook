import "../components/UserRecipeCard.css";
import { useNavigate } from "react-router-dom";

function UserRecipeCard({ recipeId, title, category, extra, from }) {
  const navigate = useNavigate();
  return (
    <div
      className="user-recipe-card"
      onClick={() =>
        navigate(`/home/recipes/${recipeId}`, {
          state: { from },
        })
      }
    >
      <div className="user-recipe-card-header">
        <h3>{title}</h3>
        <p>{category}</p>
      </div>

      <div className="user-recipe-card-footer">
        <span>{extra}</span>
      </div>
    </div>
  );
}

export default UserRecipeCard;
