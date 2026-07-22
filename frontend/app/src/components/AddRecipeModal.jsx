import "../components/AddRecipeModal.css";
import { useState, useEffect } from "react";
import { API_URL } from "../api/api.js";

function AddRecipeModal({ onClose, refreshRecipes, recipe, mode }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [newIngredients, setNewIngredients] = useState([]);

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  }

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch(`${API_URL}/categories/`);
      const data = await response.json();

      setCategories(data);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === "edit" && recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description || "");
      setInstructions(recipe.instructions);
      setCategoryId(recipe.category_id);
      setRecipeIngredients(
        recipe.ingredients.map((ingredient) => ({
          name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        })),
      );
      if (recipe.images && recipe.images.length > 0) {
        setExistingImage(recipe.images[0].url);
      }
    }
  }, [mode, recipe]);

  async function getIngredientId(name, token) {
    const response = await fetch(`${API_URL}/ingredients/`);

    const ingredients = await response.json();

    const existingIngredient = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase(),
    );

    if (existingIngredient) {
      return existingIngredient.id;
    }

    const createResponse = await fetch(`${API_URL}/ingredients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
      }),
    });

    const newIngredient = await createResponse.json();

    return newIngredient.id;
  }

  async function handleCreateRecipe() {
    if (!title || !instructions || !categoryId) {
      showMessage("Please fill all required fields.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/recipes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          instructions,
          category_id: Number(categoryId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.detail || "Failed to create recipe.", "error");
        return;
      }

      if (image) {
        const formData = new FormData();

        formData.append("file", image);

        const imageResponse = await fetch(
          `${API_URL}/recipes/${data.id}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!imageResponse.ok) {
          showMessage("Recipe created, but image upload failed.", "error");
          return;
        }
      }

      for (const ingredient of recipeIngredients) {
        const ingredientId = await getIngredientId(ingredient.name, token);

        const ingredientResponse = await fetch(
          `${API_URL}/recipes/${data.id}/ingredients`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ingredient_id: ingredientId,
              quantity: ingredient.quantity,
            }),
          },
        );

        if (!ingredientResponse.ok) {
          showMessage(
            "Recipe created, but adding ingredients failed.",
            "error",
          );
          return;
        }
      }

      showMessage("Recipe created successfully!", "success");

      await refreshRecipes();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);

      showMessage("Unable to connect to server.", "error");
    }
  }

  function addIngredient() {
    if (!ingredientName || !quantity) {
      showMessage("Enter ingredient and quantity.", "error");
      return;
    }

    const newIngredient = {
      name: ingredientName,
      quantity: quantity,
    };

    setRecipeIngredients([...recipeIngredients, newIngredient]);

    if (mode === "edit") {
      setNewIngredients([...newIngredients, newIngredient]);
    }

    setIngredientName("");
    setQuantity("");
  }

  async function handleUpdateRecipe() {
    if (!title || !instructions || !categoryId) {
      showMessage("Please fill all required fields.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/recipes/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          instructions,
          category_id: Number(categoryId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.detail || "Failed to update recipe.", "error");
        return;
      }

      for (const ingredient of newIngredients) {
        const ingredientId = await getIngredientId(ingredient.name, token);

        const ingredientResponse = await fetch(
          `${API_URL}/recipes/${recipe.id}/ingredients`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ingredient_id: ingredientId,
              quantity: ingredient.quantity,
            }),
          },
        );

        if (!ingredientResponse.ok) {
          showMessage(
            "Recipe updated, but adding ingredients failed.",
            "error",
          );
          return;
        }
      }

      if (image) {
        // 1. Delete old image
        if (recipe.images && recipe.images.length > 0) {
          const oldImageId = recipe.images[0].id;

          const deleteImageResponse = await fetch(
            `${API_URL}/recipe-images/${oldImageId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!deleteImageResponse.ok) {
            showMessage("Failed to remove old image.", "error");
            return;
          }
        }

        // 2. Upload new image
        const formData = new FormData();

        formData.append("file", image);

        const imageResponse = await fetch(
          `${API_URL}/recipes/${recipe.id}/images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!imageResponse.ok) {
          showMessage("Recipe updated, but image upload failed.", "error");
          return;
        }
      }

      await refreshRecipes();
      showMessage("Recipe updated successfully!", "success");

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);

      showMessage("Unable to connect to server.", "error");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Recipe</h2>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Instructions</label>
          <textarea
            rows="6"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label>Ingredient</label>

          <input
            type="text"
            placeholder="Example: Eggs"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          />

          <label>Quantity</label>

          <input
            type="text"
            placeholder="Example: 4 or 200g"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button
            className="add-ingredient-button"
            type="button"
            onClick={addIngredient}
          >
            + Add Ingredient
          </button>
          <div>
            {recipeIngredients.map((ingredient, index) => (
              <p key={index}>
                ✓ {ingredient.name} - {ingredient.quantity}
              </p>
            ))}
          </div>

          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="image-preview"
            />
          ) : (
            existingImage && (
              <img
                src={`${API_URL}${existingImage}`}
                alt="recipe"
                className="image-preview"
              />
            )
          )}
        </div>

        {message && <p className={`message ${messageType}`}>{message}</p>}
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>

          <button
            className="create-button"
            onClick={mode === "edit" ? handleUpdateRecipe : handleCreateRecipe}
          >
            {mode === "edit" ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddRecipeModal;
