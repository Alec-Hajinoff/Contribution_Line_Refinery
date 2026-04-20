import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserLogin.css";
import "./PasswordReset.css";
import { passwordResetToken, updatePassword } from "./ApiService";

function PasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    checking: true,
    message: "",
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenStatus({
          isValid: false,
          checking: false,
          message:
            "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
        });
        return;
      }

      try {
        const data = await passwordResetToken(token);

        if (data.valid) {
          setTokenStatus({
            isValid: true,
            checking: false,
            message: "",
          });
        } else {
          setTokenStatus({
            isValid: false,
            checking: false,
            message:
              data.message ||
              "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
          });
        }
      } catch (error) {
        setTokenStatus({
          isValid: false,
          checking: false,
          message:
            "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
        });
      }
    };

    verifyToken();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    try {
      const data = await updatePassword(token, formData.newPassword);

      if (data.success) {
        setSuccessMessage(
          "Your password has been updated.\nYou can now sign in using your new credentials.",
        );

        setPasswordUpdated(true);

        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setErrorMessage(
          data.message || "Failed to update password. Please try again.",
        );
        clearErrorMessageAfterDelay();
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      clearErrorMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (tokenStatus.checking) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="verifying-text">Verifying your link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenStatus.isValid) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <div className="error token-error" aria-live="polite">
            {tokenStatus.message}
          </div>
          <div className="return-home-container">
            <button onClick={handleReturnHome} className="btn btn-secondary">
              Return to home page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h3 className="password-reset-title">Reset your password</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              autoComplete="off"
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              required
              minLength="8"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={passwordUpdated}
            />
          </div>

          <div className="form-group">
            <input
              autoComplete="off"
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength="8"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={passwordUpdated}
            />
          </div>

          {errorMessage && (
            <div id="error-message" className="error" aria-live="polite">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              id="success-message"
              className="error success-message"
              aria-live="polite"
            >
              {successMessage}
              <div className="return-home-button-container">
                <button
                  onClick={handleReturnHome}
                  className="btn btn-secondary return-home-button"
                >
                  Return to home page
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-secondary update-password-button"
            disabled={loading || passwordUpdated}
          >
            Update password
            {loading && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                id="spinnerUpdate"
              ></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
