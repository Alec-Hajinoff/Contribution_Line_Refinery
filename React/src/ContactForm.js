import React, { useState } from "react";
import "./ContactForm.css";
import { contactForm } from "./ApiService";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectDescription: "",
    website: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const clearSuccessMessageAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const validateWordCount = (text) => {
    const words = text.trim().split(/\s+/);
    return words.length <= 200;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(formData.name)) {
      setErrorMessage(
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Please enter a valid email address (e.g., name@domain.com)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    const phonePattern = /^[\+\d\s\-\(\)]{8,20}$/;
    if (!phonePattern.test(formData.phone)) {
      setErrorMessage(
        "Please enter a valid phone number (8-20 digits, can include +, -, spaces, and parentheses)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    if (!formData.projectDescription.trim()) {
      setErrorMessage("Project description is required");
      clearErrorMessageAfterDelay();
      return;
    }

    if (!validateWordCount(formData.projectDescription)) {
      setErrorMessage("Project description must be 200 words or less");
      clearErrorMessageAfterDelay();
      return;
    }

    setLoading(true);

    try {
      const data = await contactForm(formData);

      if (data.success) {
        setSuccessMessage(
          "Thank you for your message. I will be in touch within 24 hours. Please keep an eye on your spam folder in case my email is filtered there.",
        );
        clearSuccessMessageAfterDelay();

        setFormData({
          name: "",
          email: "",
          phone: "",
          projectDescription: "",
          website: "",
        });
        setErrorMessage("");
      } else {
        setErrorMessage(
          data.message || "Failed to send message. Please try again.",
        );
        clearErrorMessageAfterDelay();
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
      clearErrorMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <h3 className="contact-form-title">Contact Me</h3>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form-group">
          <input
            autoComplete="off"
            type="text"
            className="contact-form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="contact-form-group">
          <input
            autoComplete="off"
            type="email"
            className="contact-form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email address"
          />
        </div>

        <div className="contact-form-group">
          <input
            autoComplete="off"
            type="tel"
            className="contact-form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone number (e.g., +44 123 456 789)"
          />
        </div>

        <div className="contact-form-group">
          <textarea
            autoComplete="off"
            className="contact-form-control contact-form-textarea"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Please describe your project (max 200 words)"
          />
          <small className="contact-form-word-count">
            {
              formData.projectDescription
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length
            }
            /200 words
          </small>
        </div>

        {/* Honeypot field - hidden from users but visible to bots */}
        <div className="contact-form-honeypot" style={{ display: "none" }}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {successMessage && (
          <div className="contact-form-success-message" aria-live="polite">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="contact-form-error-message" aria-live="polite">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="contact-form-btn-secondary"
          disabled={loading}
        >
          Send Message
          <span
            className="contact-form-spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            style={{ display: loading ? "inline-block" : "none" }}
          ></span>
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
