import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./Header";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import AppRoutes from "./AppRoutes";
import { checkSession } from "./ApiService";

function AppContent() {
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
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogoutComplete={verifySession}
      />
      <NavigationBar isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <AppRoutes />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
