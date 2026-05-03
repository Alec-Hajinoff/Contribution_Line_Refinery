import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";

function UserDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <div className="row mt-4 align-items-start"></div>
    </div>
  );
}

export default UserDashboard;
