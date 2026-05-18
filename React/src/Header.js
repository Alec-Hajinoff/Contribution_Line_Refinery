import React from "react";
import { Link } from "react-router-dom";
import blue from "./Hertford_Standard_Logo.svg";
import LogoutComponent from "./LogoutComponent";
import "./Header.css";

function Header({ isAuthenticated, isLoading, onLogoutComplete }) {
  return (
    <div className="header-wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-9">
            <Link to="/">
              <img
                id="logo"
                src={blue}
                alt="A company logo"
                title="A company logo"
              />
            </Link>
          </div>

          <div className="col-12 col-md-3 text-end">
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
