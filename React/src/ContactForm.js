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
        "Please enter a valid name using letters, spaces, hyphens, or apostrophes only.",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Please enter a valid email address (for example, name@domain.com).",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    const phonePattern = /^[\+\d\s\-\(\)]{8,20}$/;
    if (!phonePattern.test(formData.phone)) {
      setErrorMessage(
        "Please enter a valid phone number (8–20 digits, including optional +, -, spaces, or parentheses).",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    if (!formData.projectDescription.trim()) {
      setErrorMessage("Please provide a brief description of your project.");
      clearErrorMessageAfterDelay();
      return;
    }

    if (!validateWordCount(formData.projectDescription)) {
      setErrorMessage("Your project description should be 200 words or fewer.");
      clearErrorMessageAfterDelay();
      return;
    }

    setLoading(true);

    try {
      const data = await contactForm(formData);

      if (data.success) {
        setSuccessMessage(
          "Thank you for your message. I’ll be in touch within 24 hours. Please check your spam or junk folder just in case my reply is filtered there.",
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
          data.message ||
            "We weren’t able to send your message. Please try again.",
        );
        clearErrorMessageAfterDelay();
      }
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Something went wrong while sending your message. Please try again.",
      );
      clearErrorMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <div className="container px-0">
        <div className="row justify-content-center">
          <div className="col-12 contact-form-max-width">
            <h3 className="contact-form-title">
              Send me a brief outline of your project to start the conversation.
            </h3>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="contact-form-group mb-3">
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

                  <div className="contact-form-group mb-3">
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

                  <div className="contact-form-group mb-3">
                    <input
                      autoComplete="off"
                      type="tel"
                      className="contact-form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  {/* Removed the h-100 wrapper div - flex containers block textarea resize handle */}
                  <div className="contact-form-group">
                    <textarea
                      autoComplete="off"
                      className="contact-form-control contact-form-textarea"
                      // Removed h-100 class - allows native resize to work properly
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Please describe your project (up to 200 words)"
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
                </div>

                <div className="contact-form-honeypot">
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

                <div className="col-12">
                  {successMessage && (
                    <div
                      className="contact-form-success-message"
                      aria-live="polite"
                    >
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      className="contact-form-error-message"
                      aria-live="polite"
                    >
                      {errorMessage}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="contact-form-btn-secondary w-100"
                    disabled={loading}
                  >
                    Send
                    <span
                      className={`contact-form-spinner-border spinner-border-sm ${
                        loading ? "d-inline-block" : "d-none"
                      }`}
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
