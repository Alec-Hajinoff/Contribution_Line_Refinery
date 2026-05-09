import React, { useState, useEffect } from "react";
import { manageUsers } from "./ApiService";
import "./ManageUsers.css";

const ManageUsers = ({ selectedUser }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      fetchUserData(selectedUser.id);
    } else {
      setUserData(null);
      setError(null);
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
        setUserData(null);
      }
    } catch (err) {
      setError("Unable to fetch user data. Please try again later.");
      console.error(err);
      setUserData(null);
    } finally {
      setLoading(false);
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
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted small">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-users-container">
        <div
          className="alert alert-danger alert-dismissible fade show py-1 px-2"
          role="alert"
        >
          <small>{error}</small>
          <button
            type="button"
            className="btn-close py-0"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      <div className="user-info-card">
        <div className="user-info-row">
          <span className="user-info-label">Name:</span>
          <span className="user-info-value">{userData?.name || "-"}</span>
        </div>
        <div className="user-info-row">
          <span className="user-info-label">Email:</span>
          <span className="user-info-value">{userData?.email || "-"}</span>
        </div>
        <div className="user-info-row">
          <span className="user-info-label">Role:</span>
          <span
            className={`user-info-value role-badge ${
              userData?.is_admin ? "role-admin" : "role-user"
            }`}
          >
            {userData?.is_admin ? "Admin" : "User"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
