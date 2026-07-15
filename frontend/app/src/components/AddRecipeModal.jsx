import "../components/AddRecipeModal.css";

function AddRecipeModal({ onClose }) {
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
          <input type="text" />

          <label>Description</label>
          <textarea rows="3" />

          <label>Instructions</label>
          <textarea rows="6" />

          <label>Category</label>
          <select>
            <option>Select Category</option>
          </select>

          <label>Image</label>
          <input type="file" accept="image/*" />
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>

          <button className="create-button">Create Recipe</button>
        </div>
      </div>
    </div>
  );
}

export default AddRecipeModal;
