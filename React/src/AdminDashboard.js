import React, { useState } from "react";
import "./AdminDashboard.css";
import LogoutComponent from "./LogoutComponent";
import GetProjects from "./GetProjects";
import AdminPanel from "./AdminPanel";

function AdminDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    setRefreshProjects((prev) => prev + 1);
  };

  return (
    <div className="admin-container container">
      {" "}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>Welcome, Admin. Manage users and system settings here.</p>
          </div>

          <AdminPanel />
          <GetProjects refreshTrigger={refreshProjects} isAdminView={true} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
