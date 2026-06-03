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
    <div className="user-dashboard-container container">
      {" "}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="admin-header">
            <p>
              Welcome to your dashboard. Here you can submit new projects, track
              progress, and manage your existing work.
            </p>
          </div>

          <ProjectSubmission onProjectSubmitted={handleProjectSubmitted} />
          <GetProjects refreshTrigger={refreshProjects} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
