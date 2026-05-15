import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ isAuthenticated, isLoading, userRole }) {
  const location = useLocation();

  const getDashboardLink = () => {
    if (userRole === "admin") {
      return "/AdminDashboard";
    }
    return "/UserDashboard";
  };

  const isHomePage = location.pathname === "/";
  const isAdminDashboard = location.pathname === "/AdminDashboard";
  const isUserDashboard = location.pathname === "/UserDashboard";

  return (
    <nav>
      <div className="container">
        <div className="nav-buttons">
          {!isHomePage && (
            <Link to="/" className="nav-link btn-text">
              Home
            </Link>
          )}
          <Link to="/Aboutme" className="nav-link btn-text">
            About me
          </Link>
          <Link to="/Portfolio" className="nav-link btn-text">
            Portfolio
          </Link>
          {!isUserDashboard &&
            !isAdminDashboard &&
            !isLoading &&
            isAuthenticated && (
              <Link to={getDashboardLink()} className="nav-link btn-text">
                Dashboard
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
