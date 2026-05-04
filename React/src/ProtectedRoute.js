// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/Hertford_Standard/check_session.php",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setAuth(data.authenticated === true);
      } catch (error) {
        console.error("Error checking session:", error);
        setAuth(false);
      }
    };

    checkSession();
  }, []);

  if (auth === null) return null;

  return auth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
