import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar() {
  const location = useLocation();

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
          <Link to="/Dashboard" className="nav-link btn-text">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
