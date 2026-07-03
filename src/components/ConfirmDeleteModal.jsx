import { useState } from "react";

export default function ConfirmDeleteModal({ user, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError("Couldn't delete this user. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal" role="dialog" aria-modal="true">
        <h2>Delete user?</h2>
        <p>
          This will remove <strong>{user.firstName} {user.lastName}</strong> from the list.
          This can't be undone.
        </p>
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
