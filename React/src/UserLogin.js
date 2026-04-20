import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { loginUser, passwordResetLink } from "./ApiService";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [unverifiedMessage, setUnverifiedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const clearUnverifiedMessageAfterDelay = () => {
    setTimeout(() => {
      setUnverifiedMessage("");
    }, 5000);
  };

  const clearResetMessageAfterDelay = () => {
    setTimeout(() => {
      setResetMessage("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Please enter a valid email address (e.g., name@domain.com)",
      );
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    setErrorMessage("");
    setUnverifiedMessage("");

    try {
      const data = await loginUser(formData);
      if (data.status === "success") {
        navigate("/UserDashboard");
      } else if (data.status === "unverified") {
        setUnverifiedMessage(data.message);
        clearUnverifiedMessageAfterDelay();
        setFormData({ password: "" });
      } else {
        setErrorMessage(data.message || "Sign in failed. Please try again.");
        clearErrorMessageAfterDelay();
        setFormData({ password: "" });
      }
    } catch (error) {
      setErrorMessage(error.message);
      clearErrorMessageAfterDelay();
      setFormData({ password: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailInput = document.getElementById("yourEmailLogin");
    const email = emailInput ? emailInput.value : formData.email;

    if (!email || !email.trim()) {
      setErrorMessage("Please enter your email address first");
      clearErrorMessageAfterDelay();
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      await passwordResetLink(email);
      setResetMessage(
        "If an account exists for that email, we've sent a password reset link.",
      );
      clearResetMessageAfterDelay();
    } catch (error) {
      setResetMessage(
        "If an account exists for that email, we've sent a password reset link.",
      );
      clearResetMessageAfterDelay();
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit} noValidate>
      {" "}
      {/* noValidate disables browser validation */}
      <div className="form-group">
        <input
          autoComplete="off"
          type="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          className="form-control"
          id="yourEmailLogin"
          name="email"
          required
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          autoComplete="off"
          type="password"
          className="form-control"
          id="yourPasswordLogin"
          name="password"
          required
          minLength="8"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      {unverifiedMessage && (
        <div id="unverified-message" className="error" aria-live="polite">
          {unverifiedMessage}
        </div>
      )}
      <div id="error-message-one" className="error" aria-live="polite">
        {errorMessage}
      </div>
      {resetMessage && (
        <div id="reset-message" className="reset-message" aria-live="polite">
          {resetMessage}
        </div>
      )}
      <button type="submit" className="btn btn-secondary" id="loginBtn">
        Login
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          id="spinnerLogin"
          style={{ display: loading ? "inline-block" : "none" }}
        ></span>
      </button>
      <div className="forgot-password-link-container">
        <button
          type="button"
          className="forgot-password-link"
          onClick={handleForgotPassword}
          disabled={resetLoading}
        >
          Forgot your password?
          {resetLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              id="spinnerReset"
            ></span>
          )}
        </button>
      </div>
      <div id="liveAlertPlaceholder"></div>
    </form>
  );
}

export default UserLogin;
