import React, { useState } from "react";
import { projectMessages } from "./ApiService";
import "./ProjectMessages.css";

const ProjectMessages = ({ projectId, onMessageSubmitted }) => {
  const [formData, setFormData] = useState({
    message: "",
    attachments: [],
  });

  const [uploadProgress, setUploadProgress] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fileErrors, setFileErrors] = useState([]);

  const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message.text) setMessage({ text: "", type: "" });
  };

  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `${file.name} can’t be uploaded. Please choose a PNG, JPEG, or PDF file.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} is too large. Please upload files under 10MB.`;
    }
    return null;
  };

  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));

    setMessage({
      text: "Your file has been removed.",
      type: "success",
    });

    clearMessageAfterDelay();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const errors = [];
    const validNewFiles = [];

    const currentFileCount = formData.attachments.length;
    if (currentFileCount + newFiles.length > MAX_FILES) {
      setMessage({
        text: `You can upload up to ${MAX_FILES} files. You already have ${currentFileCount} selected, so please remove one before adding another.`,
        type: "error",
      });
      clearMessageAfterDelay();
      e.target.value = "";
      return;
    }

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validNewFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
    } else {
      setFileErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validNewFiles],
    }));

    e.target.value = "";

    if (validNewFiles.length === 0 && newFiles.length > 0) {
      setMessage({
        text: "We couldn’t add any of those files. Please check that they are the correct format and under 10MB.",
        type: "error",
      });
      clearMessageAfterDelay();
    } else if (validNewFiles.length < newFiles.length) {
      setMessage({
        text: `${validNewFiles.length} file(s) added. ${errors.length} couldn’t be uploaded due to format or size limits.`,
        type: "warning",
      });
      clearMessageAfterDelay();
    } else if (validNewFiles.length > 0) {
      setMessage({
        text: `${validNewFiles.length} file(s) added. You now have ${
          formData.attachments.length + validNewFiles.length
        } of ${MAX_FILES} files attached.`,
        type: "success",
      });
      clearMessageAfterDelay();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setMessage({
        text: "Please enter a message before submitting.",
        type: "error",
      });
      clearMessageAfterDelay();
      return;
    }

    setUploadProgress(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await projectMessages(projectId, formData);

      if (result.success) {
        setMessage({
          text: "Your update has been sent successfully.",
          type: "success",
        });
        clearMessageAfterDelay();
        setFormData({
          message: "",
          attachments: [],
        });
        const fileInput = document.getElementById("pm-attachments");
        if (fileInput) fileInput.value = "";
        setFileErrors([]);
        if (onMessageSubmitted) onMessageSubmitted();
      } else {
        setMessage({
          text:
            result.message || "We couldn’t send your update. Please try again.",
          type: "error",
        });
        clearMessageAfterDelay();
      }
    } catch (error) {
      setMessage({
        text:
          error.message ||
          "Something went wrong while sending your update. Please try again.",
        type: "error",
      });
      clearMessageAfterDelay();
    } finally {
      setUploadProgress(false);
    }
  };

  return (
    <div className="project-messages-container">
      <div className="pm-card">
        <div className="pm-card-header">
          <h5>Share an Update or Request a Change</h5>
        </div>
        <div className="pm-card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="message" className="pm-form-label">
                Describe your update or request{" "}
                <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe the update, change, or question - including any relevant details or context…"
                disabled={uploadProgress}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="pm-attachments" className="pm-form-label">
                Attachments (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="pm-attachments"
                onChange={handleFileChange}
                disabled={uploadProgress}
                multiple="multiple"
                accept=".png,.jpg,.jpeg,.pdf"
              />
              <div className="form-text">
                Accepted formats: PNG, JPEG, PDF. Max 10MB per file. Up to 5
                files.
              </div>

              {fileErrors.length > 0 && (
                <div className="pm-file-issues-text mt-2">
                  <strong>File validation issues:</strong>
                  <ul className="mb-0 mt-1">
                    {fileErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.attachments.length > 0 && (
                <div className="pm-selected-files mt-2">
                  <p>
                    Selected files ({formData.attachments.length}/{MAX_FILES}):
                  </p>
                  <ul className="list-unstyled mt-1">
                    {formData.attachments.map((file, idx) => (
                      <li
                        key={idx}
                        className="pm-file-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          <i className="bi bi-paperclip me-1"></i>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
                        <button
                          type="button"
                          className="pm-btn-remove-file"
                          onClick={() => removeFile(idx)}
                          disabled={uploadProgress}
                          aria-label="Remove file"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {message.text && message.type === "success" && (
              <div id="pm-success-message">{message.text}</div>
            )}
            {message.text && message.type !== "success" && (
              <div id="pm-error-message">{message.text}</div>
            )}

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="pm-action-btn"
                disabled={uploadProgress}
              >
                {uploadProgress ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectMessages;
