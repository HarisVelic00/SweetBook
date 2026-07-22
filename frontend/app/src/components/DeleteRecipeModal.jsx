import "./DeleteRecipeModal.css";

function DeleteRecipeModal({ onClose, onConfirm }) {
  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h2>Delete Recipe</h2>

          <button className="delete-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="delete-modal-body">
          <p>Are you sure you want to delete this recipe?</p>

          <p>This action cannot be undone.</p>
        </div>

        <div className="delete-modal-footer">
          <button className="delete-cancel-button" onClick={onClose}>
            Cancel
          </button>

          <button className="confirm-delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRecipeModal;
