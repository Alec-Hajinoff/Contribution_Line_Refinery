import React, { useState, useEffect } from "react";
import { manageUsers, updateUserName, userDeletion } from "./ApiService";
import "./ManageUsers.css";

const ManageUsers = ({ selectedUser, onUserUpdated, onUserDeleted }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      fetchUserData(selectedUser.id);
    } else {
      setUserData(null);
      setIsEditing(false);
      setIsDeleteConfirming(false);
    }
  }, [selectedUser]);

  const fetchUserData = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await manageUsers(userId);
      if (result.success) {
        setUserData(result.user);
      } else {
        setError(result.message || "Failed to load user data.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditValue(userData.name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editValue.trim()) {
      setError("Name cannot be empty");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateUserName(userData.id, editValue.trim());
      if (result.success) {
        setUserData({ ...userData, name: editValue.trim() });
        setIsEditing(false);
        setEditValue("");
        if (onUserUpdated) {
          onUserUpdated();
        }
      } else {
        setError(result.message || "Failed to update name");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("An error occurred while updating name");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirming(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirming(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await userDeletion(userData.id);
      if (result.success) {
        setIsDeleteConfirming(false);
        if (onUserUpdated) {
          onUserUpdated();
        }
        if (onUserDeleted) {
          onUserDeleted();
        }
      } else {
        setError(result.message || "Failed to delete user");
        setTimeout(() => setError(null), 3000);
        setIsDeleteConfirming(false);
      }
    } catch (err) {
      setError("An error occurred while deleting user");
      setTimeout(() => setError(null), 3000);
      setIsDeleteConfirming(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="manage-users-container">
        <div className="manage-users-placeholder">
          <i
            className="bi bi-person-circle"
            style={{ fontSize: "1.5rem", color: "#ccc" }}
          ></i>
          <p className="text-muted small mt-2 mb-0">
            Select a user from the dropdown above
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="manage-users-container">
        <div className="text-center py-3">
          <div
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          ></div>
          <span className="text-muted small">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="manage-users-container">
        <div className="alert alert-danger py-1 px-2">
          <small>{error}</small>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="manage-users-container">
      {error && (
        <div className="alert alert-danger py-1 px-2 mb-2">
          <small>{error}</small>
        </div>
      )}

      <div className="user-info-card">
        <div className="user-info-row">
          <span className="user-info-label">Name:</span>
          <div className="user-info-value-with-edit">
            {isEditing ? (
              <div className="inline-edit-container">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  disabled={isUpdating}
                  autoFocus
                />
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  ✓
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  ✗
                </button>
              </div>
            ) : (
              <>
                <span className="user-info-value">{userData.name}</span>
                <button
                  className="btn-edit-icon"
                  onClick={handleEditClick}
                  title="Edit name"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
        </div>

        <div className="user-info-row">
          <span className="user-info-label">Email:</span>
          <span className="user-info-value">{userData.email}</span>
        </div>

        <div className="user-info-row delete-row">
          <span className="user-info-label">Delete User:</span>
          <div className="delete-controls">
            {!isDeleteConfirming ? (
              <button
                className="btn-delete"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                🗑️ Delete user
              </button>
            ) : (
              <div className="delete-confirmation">
                <span className="confirm-message">Sure?</span>
                <button
                  className="btn-confirm-delete"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete user"}
                </button>
                <button
                  className="btn-cancel-delete"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
