import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import ProjectSubmission from "./ProjectSubmission";
import GetProjects from "./GetProjects";

function UserDashboard() {
  const [refreshProjects, setRefreshProjects] = useState(0);

  const handleProjectSubmitted = () => {
    setRefreshProjects((prev) => prev + 1);
  };

  return (
    <div className="container">
      <div className="admin-header">
        <p>Welcome, User. Submit and manage your projects here.</p>
      </div>

      <ProjectSubmission onProjectSubmitted={handleProjectSubmitted} />
      <GetProjects refreshTrigger={refreshProjects} />
    </div>
  );
}

export default UserDashboard;
