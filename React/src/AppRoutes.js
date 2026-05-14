import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import UserDashboard from "./UserDashboard";
import LogoutComponent from "./LogoutComponent";
import VerifyEmail from "./VerifyEmail";
import PasswordReset from "./PasswordReset";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AboutMe from "./AboutMe";
import Portfolio from "./Portfolio";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="/Aboutme" element={<AboutMe />} />
      <Route path="/Portfolio" element={<Portfolio />} />

      <Route path="/Privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/Termsofservice" element={<TermsOfService />} />
      <Route path="/RegisteredPage" element={<RegisteredPage />} />
      <Route path="/LogoutComponent" element={<LogoutComponent />} />
      <Route path="/VerifyEmail" element={<VerifyEmail />} />
      <Route path="/PasswordReset" element={<PasswordReset />} />
      <Route
        path="/UserDashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/AdminDashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
