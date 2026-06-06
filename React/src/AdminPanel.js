import React, { useState } from "react";
import "./AdminPanel.css";
import GetUsers from "./GetUsers";
import ManageUsers from "./ManageUsers";

const AdminPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshUsersTrigger, setRefreshUsersTrigger] = useState(0);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleUserUpdated = () => {
    setRefreshUsersTrigger((prev) => prev + 1);
  };

  const handleUserDeleted = () => {
    setSelectedUser(null);
    setRefreshUsersTrigger((prev) => prev + 1);
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header text-center">
        <h4>User Management</h4>
      </div>
      <div className="admin-panel-content">
        <GetUsers
          onUserSelect={handleUserSelect}
          refreshTrigger={refreshUsersTrigger}
        />
        <ManageUsers
          selectedUser={selectedUser}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
