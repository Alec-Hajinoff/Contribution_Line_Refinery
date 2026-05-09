import React from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h4 className="admin-panel-title">User Management</h4>
        <p className="admin-panel-subtitle">
          Manage system users and their permissions
        </p>
      </div>
      <div className="admin-panel-placeholder">
        <i
          className="bi bi-people"
          style={{ fontSize: "2rem", color: "#ccc" }}
        ></i>
        <p className="text-muted mt-2 mb-0">
          User management controls will appear here
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
