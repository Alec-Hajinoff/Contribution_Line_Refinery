import React, { useState } from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";
import GetProjects from "./GetProjects";

function AdminDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    setRefreshProjects((prev) => prev + 1);
  };

  return (
    <div className="admin-container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="admin-header">
        <p>Welcome, Admin. Manage users and system settings here.</p>
      </div>

      <GetProjects refreshTrigger={refreshProjects} isAdminView={true} />
    </div>
  );
}

export default AdminDashboard;
