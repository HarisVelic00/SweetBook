import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Ratings from "./pages/Ratings";
import Favorites from "./pages/Favorites";
import EditRecipe from "./components/EditRecipe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />}>
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetails />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="recipes/:id/edit" element={<EditRecipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
