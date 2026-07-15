import "../styles/Favorites.css";
import UserRecipeCard from "../components/UserRecipeCard";

function Favorites() {
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your favorites</h1>
      </div>

      <div className="favorites-search">
        <input type="text" placeholder="Search favorite recipes..." />
      </div>

      <div className="favorites-list"></div>
      <UserRecipeCard
        title="Kinder Pingui"
        category="Cake"
        extra="❤️ Favorite"
      />
    </div>
  );
}

export default Favorites;
