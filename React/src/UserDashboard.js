// UserDashboard.js
import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import ProjectSubmission from "./ProjectSubmission";
import GetProjects from "./GetProjects";

function UserDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    // Increment refresh trigger to cause GetProjects to refetch
    setRefreshProjects(prev => prev + 1);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="admin-header">
        <p>Welcome, User. Submit and manage your projects here.</p>
      </div>

      <ProjectSubmission onProjectSubmitted={handleProjectSubmitted} />
      <GetProjects refreshTrigger={refreshProjects} />
    </div>
  );
}

export default UserDashboard;

/*
// UserDashboard.js
import React from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import ProjectSubmission from "./ProjectSubmission";

function UserDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="admin-header">
        <p>Welcome, User. Submit and manage your projects here.</p>
      </div>

      <ProjectSubmission />
    </div>
  );
}

export default UserDashboard;
*/