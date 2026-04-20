import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import AddContribution from "./AddContribution";
import ContributionsTimeline from "./ContributionsTimeline";

function UserDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContributionAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="row mt-4 align-items-start">
        <div className="col-md-4">
          <AddContribution onContributionAdded={handleContributionAdded} />
        </div>

        <div className="col-md-8">
          <ContributionsTimeline key={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
