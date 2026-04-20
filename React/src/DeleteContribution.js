import React, { useState } from "react";
import { deleteContribution } from "./ApiService";
import "./DeleteContribution.css";

const DeleteContribution = ({ contributionId, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteContribution(contributionId);
      if (result.status === "success") {
        onDelete(contributionId);
      } else {
        setError(result.message || "Failed to delete contribution");
        setShowConfirm(false);
        setIsDeleting(false);
      }
    } catch (err) {
      setError(err.message || "An error occurred while deleting");
      setShowConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setError(null);
  };

  if (error) {
    return (
      <div className="delete-error d-inline-flex align-items-center">
        <span className="text-danger small me-2">{error}</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setError(null)}
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="delete-confirm d-inline-flex align-items-center gap-2">
        <span className="small text-secondary">Sure?</span>
        <button
          className="btn btn-sm btn-danger"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "..." : "Delete"}
        </button>
        <button
          className="btn btn-sm btn-link text-secondary p-0"
          onClick={handleCancelDelete}
          disabled={isDeleting}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-sm btn-outline-danger"
      onClick={handleDeleteClick}
    >
      <span role="img" aria-label="delete">
        🗑️
      </span>{" "}
      Delete
    </button>
  );
};

export default DeleteContribution;
