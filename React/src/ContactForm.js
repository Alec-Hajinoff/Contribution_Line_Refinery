import React, { useState } from "react";
import "./ContactForm.css";
import { contactForm } from "./ApiService";
// Note: Bootstrap is already imported globally in index.html, 
// so we don't need to import it again here

function ContactForm() {
  // State for form data - stores all input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectDescription: "",
    website: "", // Honeypot field for bot detection
  });

  // State for UI feedback messages
  const [errorMessage, setErrorMessage] = useState("");   // Error message display
  const [successMessage, setSuccessMessage] = useState(""); // Success message display
  const [loading, setLoading] = useState(false); // Loading state for submit button

  /**
   * Handle input changes for all form fields
   * Updates formData state with new values as user types
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Auto-clear error message after 5 seconds
   * Provides better UX by removing stale error messages
   */
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  /**
   * Auto-clear success message after 5 seconds
   */
  const clearSuccessMessageAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  /**
   * Validate that project description doesn't exceed 200 words
   * @param {string} text - The project description text
   * @returns {boolean} - True if under or equal to 200 words
   */
  const validateWordCount = (text) => {
    const words = text.trim().split(/\s+/);
    return words.length <= 200;
  };

  /**
   * Handle form submission with validation and API call
   * Validates all fields before sending to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission

    // Validate name: only letters, spaces, hyphens, and apostrophes
    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(formData.name)) {
      setErrorMessage(
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    // Validate email format using standard regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Please enter a valid email address (e.g., name@domain.com)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    // Validate phone number: 8-20 characters, allows +, -, spaces, parentheses
    const phonePattern = /^[\+\d\s\-\(\)]{8,20}$/;
    if (!phonePattern.test(formData.phone)) {
      setErrorMessage(
        "Please enter a valid phone number (8-20 digits, can include +, -, spaces, and parentheses)",
      );
      clearErrorMessageAfterDelay();
      return;
    }

    // Validate project description is not empty
    if (!formData.projectDescription.trim()) {
      setErrorMessage("Project description is required");
      clearErrorMessageAfterDelay();
      return;
    }

    // Validate project description word count (max 200 words)
    if (!validateWordCount(formData.projectDescription)) {
      setErrorMessage("Project description must be 200 words or less");
      clearErrorMessageAfterDelay();
      return;
    }

    // All validation passed - proceed with API submission
    setLoading(true);

    try {
      // Call the API service to submit the form
      const data = await contactForm(formData);

      if (data.success) {
        // Show success message on successful submission
        setSuccessMessage(
          "Thank you for your message. I will be in touch within 24 hours. Please keep an eye on your spam folder in case my email is filtered there.",
        );
        clearSuccessMessageAfterDelay();

        // Reset all form fields after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectDescription: "",
          website: "",
        });
        setErrorMessage(""); // Clear any existing error messages
      } else {
        // Show error message from API response
        setErrorMessage(
          data.message || "Failed to send message. Please try again.",
        );
        clearErrorMessageAfterDelay();
      }
    } catch (error) {
      // Handle network or unexpected errors
      setErrorMessage(error.message || "An error occurred. Please try again.");
      clearErrorMessageAfterDelay();
    } finally {
      setLoading(false); // Re-enable submit button
    }
  };

  return (
    <div className="contact-form-wrapper">
      {/* 
        Bootstrap Grid Layout:
        - container: Creates a responsive fixed-width container
        - px-0: Removes horizontal padding to match existing design
        - row: Creates a flexbox grid row
        - justify-content-center: Centers the content horizontally
      */}
      <div className="container px-0">
        <div className="row justify-content-center">
          
          {/* 
            Fixed max-width wrapper (600px)
            col-12: Takes full width on all screen sizes
            style maxWidth: Constrains the form width on larger screens
          */}
          <div className="col-12">
            
            {/* Form Title */}
            <h3 className="contact-form-title">
              Provide a brief outline of your project to start the conversation.
            </h3>
            
            {/* 
              Form Component with Bootstrap Grid:
              - row: Creates a grid row
              - g-3: Adds gutter (spacing) of 1rem between columns
            */}
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                
                {/* ========== LEFT COLUMN (Desktop) ========== */}
                {/* 
                  col-md-6: On medium screens (768px+) takes 6 columns (50% width)
                  On smaller screens (<768px) automatically takes full width (stacked layout)
                */}
                <div className="col-md-6">
                  
                  {/* Name Field */}
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

                  {/* Email Field */}
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

                  {/* Phone Field */}
                  <div className="contact-form-group mb-3">
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
                </div> {/* End Left Column */}
                
                {/* ========== RIGHT COLUMN (Desktop) ========== */}
                {/* 
                  col-md-6: On medium screens+ takes remaining 6 columns
                  Stacks below left column on mobile
                */}
                <div className="col-md-6">
                  
                  {/* Project Description Field */}
                  <div className="contact-form-group">
                    <textarea
                      autoComplete="off"
                      className="contact-form-control contact-form-textarea"
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Please describe your project (up to 200 words)"
                      // Make textarea height match left column fields on desktop
                      style={{ height: '100%', minHeight: '120px' }}
                    />
                    {/* Live word counter - shows current word count / 200 */}
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
                </div> {/* End Right Column */}

                {/* 
                  ========== HONEYPOT FIELD (Anti-spam) ==========
                  Hidden from real users but visible to bots
                  If this field gets filled, we know it's a bot
                */}
                <div className="contact-form-honeypot" style={{ display: "none" }}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1" // Can't be reached by keyboard navigation
                    autoComplete="off"
                  />
                </div>

                {/* 
                  ========== MESSAGES SECTION ==========
                  col-12: Takes full width on all screen sizes
                  Messages span across both columns below the form fields
                */}
                <div className="col-12">
                  
                  {/* Success Message Display */}
                  {successMessage && (
                    <div className="contact-form-success-message" aria-live="polite">
                      {successMessage}
                    </div>
                  )}

                  {/* Error Message Display */}
                  {errorMessage && (
                    <div className="contact-form-error-message" aria-live="polite">
                      {errorMessage}
                    </div>
                  )}
                </div>

                {/* 
                  ========== SUBMIT BUTTON SECTION ==========
                  col-12: Full width button across both columns
                  w-100: Makes button stretch to full container width
                */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="contact-form-btn-secondary w-100"
                    disabled={loading} // Disable button while submitting
                  >
                    Send Message
                    {/* Loading Spinner - only visible when loading state is true */}
                    <span
                      className="contact-form-spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{ display: loading ? "inline-block" : "none" }}
                    ></span>
                  </button>
                </div>

              </div> {/* End Grid Row */}
            </form>
            
          </div> {/* End Max-width Wrapper */}
        </div> {/* End Centering Row */}
      </div> {/* End Container */}
    </div> // End contact-form-wrapper
  );
}

export default ContactForm;

/*
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
      <h3 className="contact-form-title">
        Provide a brief outline of your project to start the conversation.
      </h3>
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

        // Honeypot field - hidden from users but visible to bots 
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
*/