import "../components/Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1>Menu</h1>

        <nav className="sidebar-nav">
          <NavLink to="recipes">Recipes</NavLink>
          <NavLink to="ratings">Ratings</NavLink>
          <NavLink to="favorites">Favorites</NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
