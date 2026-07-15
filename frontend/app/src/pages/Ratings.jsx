import "../styles/Ratings.css";
import UserRecipeCard from "../components/UserRecipeCard";

function Ratings() {
  return (
    <div className="ratings-page">
      <div className="ratings-header">
        <h1>Your ratings</h1>
      </div>

      <div className="ratings-search">
        <input type="text" placeholder="Search rated recipes..." />
      </div>

      <div className="ratings-list">
        <UserRecipeCard
          title="Kinder Pingui"
          category="Cake"
          extra="⭐ Your Rating: 5/5"
        />
      </div>
    </div>
  );
}

export default Ratings;
