import React, { useState } from "react";
import "./AdminPanel.css";
import GetUsers from "./GetUsers";

const AdminPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    console.log("Selected user:", user);
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h4 className="admin-panel-title">User Management</h4>
        <p className="admin-panel-subtitle">
          Manage system users and their permissions
        </p>
      </div>
      <div className="admin-panel-content">
        <GetUsers onUserSelect={handleUserSelect} />
        {selectedUser && (
          <div className="selected-user-info mt-2">
            <small className="text-muted">
              Selected: <strong>{selectedUser.name}</strong> (ID:{" "}
              {selectedUser.id})
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
