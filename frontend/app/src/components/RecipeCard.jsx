import "../components/RecipeCard.css";
import { useNavigate } from "react-router-dom";

function RecipeCard() {
  const navigate = useNavigate();

  return (
    <div className="recipe-card" onClick={() => navigate("/home/recipes/1")}>
      <div className="recipe-card-header">
        <h2>Kinder Pingui</h2>
        <p className="recipe-category">Cake</p>
      </div>

      <div className="recipe-card-body">
        <p className="recipe-description">
          A chilled, layered dessert inspired by the popular Kinder bar
        </p>
      </div>

      <div className="recipe-card-footer">
        <span>⭐ 4.8</span>
        <span>❤️ 12</span>
      </div>
    </div>
  );
}

export default RecipeCard;
