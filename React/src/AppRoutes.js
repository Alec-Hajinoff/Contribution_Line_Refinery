import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import UserDashboard from "./UserDashboard";
import LogoutComponent from "./LogoutComponent";
import PresentationView from "./PresentationView";
import VerifyEmail from "./VerifyEmail";
import PasswordReset from "./PasswordReset";
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="/RegisteredPage" element={<RegisteredPage />} />
      <Route path="/UserDashboard" element={<UserDashboard />} />
      <Route path="/LogoutComponent" element={<LogoutComponent />} />
      <Route path="/PresentationView/:id" element={<PresentationView />} />
      <Route path="/VerifyEmail" element={<VerifyEmail />} />
      <Route path="/PasswordReset" element={<PasswordReset />} />
    </Routes>
  );
}
