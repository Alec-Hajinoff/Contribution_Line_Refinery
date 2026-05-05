import React, { useState } from "react";
import { projectSubmission } from "./ApiService";
import "./ProjectSubmission.css";

const ProjectSubmission = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachments: [],
  });

  const [uploadProgress, setUploadProgress] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fileErrors, setFileErrors] = useState([]);

  const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_FILES = 5;

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
      return `Invalid file type for ${file.name}. Allowed: PNG, JPEG, PDF`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds 10MB limit`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validFiles = [];

    if (files.length > MAX_FILES) {
      setMessage({
        text: `You can only upload up to ${MAX_FILES} files per submission.`,
        type: "error",
      });
      return;
    }

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
    } else {
      setFileErrors([]);
    }

    setFormData((prev) => ({
      ...prev,
      attachments: validFiles,
    }));

    if (validFiles.length === 0 && files.length > 0) {
      setMessage({
        text: "No valid files were selected. Please check file types and sizes.",
        type: "error",
      });
    } else if (validFiles.length < files.length) {
      setMessage({
        text: `${validFiles.length} of ${files.length} file(s) accepted. ${errors.length} file(s) skipped due to validation errors.`,
        type: "warning",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setMessage({ text: "Project title is required.", type: "error" });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ text: "Project description is required.", type: "error" });
      return;
    }

    setUploadProgress(true);
    setMessage({ text: "", type: "" });

    try {
      const result = await projectSubmission(formData);

      if (result.success) {
        setMessage({
          text: `Project "${formData.title}" submitted successfully!`,
          type: "success",
        });

        setFormData({
          title: "",
          description: "",
          attachments: [],
        });

        const fileInput = document.getElementById("project-attachments");
        if (fileInput) fileInput.value = "";
        setFileErrors([]);
      } else {
        setMessage({
          text: result.message || "Submission failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setUploadProgress(false);
    }
  };

  return (
    <div className="project-submission-container">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Submit New Project</h3>
        </div>
        <div className="card-body">
          {message.text && (
            <div
              className={`alert alert-${
                message.type === "error"
                  ? "danger"
                  : message.type === "warning"
                  ? "warning"
                  : "success"
              } alert-dismissible fade show`}
              role="alert"
            >
              {message.text}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setMessage({ text: "", type: "" })}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Project Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                disabled={uploadProgress}
                maxLength="255"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-semibold">
                Project Description <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed project specifications..."
                disabled={uploadProgress}
                required
              ></textarea>
              <div className="form-text">
                Be as detailed as possible to help us understand your
                requirements.
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="project-attachments"
                className="form-label fw-semibold"
              >
                Attachments (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="project-attachments"
                onChange={handleFileChange}
                disabled={uploadProgress}
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
              />
              <div className="form-text">
                Accepted formats: PNG, JPEG, PDF. Max 10MB per file. Up to 5
                files.
              </div>

              {fileErrors.length > 0 && (
                <div className="alert alert-warning mt-2">
                  <strong>File validation issues:</strong>
                  <ul className="mb-0 mt-1">
                    {fileErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.attachments.length > 0 && (
                <div className="selected-files mt-2">
                  <strong>
                    Selected files ({formData.attachments.length}/5):
                  </strong>
                  <ul className="list-unstyled mt-1">
                    {formData.attachments.map((file, idx) => (
                      <li key={idx} className="file-item">
                        <i className="bi bi-paperclip me-1"></i>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={uploadProgress}
              >
                {uploadProgress ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting Project...
                  </>
                ) : (
                  "Submit Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
