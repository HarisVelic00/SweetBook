import "../components/RecipeCard.css";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/home/recipes/${recipe.id}`)}
    >
      <div className="recipe-card-header">
        <h2>{recipe.title}</h2>
        <p className="recipe-category">{recipe.category_name}</p>
      </div>

      <div className="recipe-card-body">
        <p className="recipe-description">{recipe.description}</p>
      </div>

      <div className="recipe-card-footer">
        <span>⭐ 4.8</span>
        <span>❤️ 12</span>
      </div>
    </div>
  );
}

export default RecipeCard;
