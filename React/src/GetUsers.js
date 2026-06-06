import React, { useState, useEffect } from "react";
import { getUsers } from "./ApiService";
import "./GetUsers.css";

const GetUsers = ({ onUserSelect, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        setError(result.message || "Failed to load users.");
      }
    } catch (err) {
      setError("Unable to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (onUserSelect) {
      const selectedUser = users.find((user) => user.id.toString() === userId);
      onUserSelect(selectedUser);
    }
  };

  if (loading) {
    return (
      <div className="get-users-container">
        <div className="text-center py-2">
          <div
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted small">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="get-users-container">
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

  if (users.length === 0) {
    return (
      <div className="get-users-container">
        <p className="text-muted small mb-0">No users found</p>
      </div>
    );
  }

  return (
    <div className="get-users-container">
      <select
        id="user-select"
        className="form-select form-select-sm"
        value={selectedUserId}
        onChange={handleUserChange}
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GetUsers;
