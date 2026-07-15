import "../components/UserRecipeCard.css";
import { useNavigate } from "react-router-dom";

function UserRecipeCard({ title, category, extra }) {
  const navigate = useNavigate();
  return (
    <div
      className="user-recipe-card"
      onClick={() => navigate("/home/recipe/1")}
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
