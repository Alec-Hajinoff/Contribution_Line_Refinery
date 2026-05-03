import React, { useState } from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";

function AdminDashboard() {
  return (
    <div className="admin-container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="admin-header">
        <p>Welcome, Admin. Manage users and system settings here.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
