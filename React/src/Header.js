import React from "react";
import { Link } from "react-router-dom";
import blue from "./HertfordStandardLogo.png";
import LogoutComponent from "./LogoutComponent";
import "./Header.css";

function Header({ isAuthenticated, isLoading, onLogoutComplete }) {
  return (
    <div className="header-wrapper">
      <div className="container">
        <div className="row">
          <div className="logo-container">
            <Link to="/">
              <img
                id="logo"
                src={blue}
                alt="A company logo"
                title="A company logo"
              />
            </Link>
          </div>
          <div className="logout-container">
            {!isLoading && isAuthenticated && (
              <LogoutComponent onLogoutComplete={onLogoutComplete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
