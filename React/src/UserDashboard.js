import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";

function UserDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="admin-header">
        <p>Welcome, User. Submit and manage your projects here.</p>
      </div>
    </div>
  );
}

export default UserDashboard;
