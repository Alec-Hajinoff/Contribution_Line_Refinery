import React, { useState } from "react";
import { statusUpdate } from "./ApiService";
import "./StatusUpdate.css";

const StatusUpdate = ({ projectId, currentStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.checked ? "completed" : "in_progress";

    setUpdating(true);
    setError(null);

    try {
      const result = await statusUpdate(projectId, newStatus);

      if (result.success) {
        setStatus(newStatus);
        if (onStatusUpdated) {
          onStatusUpdated(projectId, newStatus);
        }
      } else {
        setError(result.message || "Failed to update status.");

        e.target.checked = !e.target.checked;
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating status.");

      e.target.checked = !e.target.checked;
    } finally {
      setUpdating(false);

      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="status-update-container">
      <div className="status-toggle-wrapper">
        <span>Project Status:</span>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-switch-${projectId}`}
            checked={status === "completed"}
            onChange={handleStatusChange}
            disabled={updating}
          />
          <label
            className="form-check-label"
            htmlFor={`status-switch-${projectId}`}
          >
            <span
              className={`status-text ${
                status === "in_progress" ? "active" : ""
              }`}
            >
              In progress
            </span>
            <span className="status-separator">→</span>
            <span
              className={`status-text ${
                status === "completed" ? "active" : ""
              }`}
            >
              Completed
            </span>
          </label>
        </div>
      </div>
      {updating && (
        <div className="status-updating-indicator">
          <span
            className="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          <small>Updating...</small>
        </div>
      )}
      {error && (
        <div className="status-error alert alert-danger alert-dismissible fade show py-1 px-2 mt-1">
          <small>{error}</small>
          <button
            type="button"
            className="btn-close py-0"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
    </div>
  );
};

export default StatusUpdate;
