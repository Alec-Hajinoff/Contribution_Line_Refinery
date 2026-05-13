import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import blue from "./HertfordStandardLogo.png";
import LogoutComponent from "./LogoutComponent";
import { checkSession } from "./ApiService";
import "./Header.css";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const verifySession = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await checkSession();
      setIsAuthenticated(result.authenticated);
    } catch (error) {
      console.error("Session check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [location.pathname, verifySession]);

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
              <LogoutComponent onLogoutComplete={verifySession} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
