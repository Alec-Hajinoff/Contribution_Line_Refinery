import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ isAuthenticated, isLoading }) {
  return (
    <nav>
      <div className="container">
        <div className="nav-buttons">
          <Link to="/" className="nav-link btn-text">
            Home
          </Link>
          <Link to="/Aboutme" className="nav-link btn-text">
            About me
          </Link>
          <Link to="/Portfolio" className="nav-link btn-text">
            Portfolio
          </Link>
          {!isLoading && isAuthenticated && (
            <Link to="/Dashboard" className="nav-link btn-text">
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
