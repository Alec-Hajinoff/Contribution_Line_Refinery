import React, { useState } from "react";
import { updateContribution } from "./ApiService";
import "./UpdateContribution.css";

const CATEGORY_OPTIONS = [
  "Core Role / Job Performance",
  "Leadership / Ownership",
  "Cross-Team Collaboration",
  "Problem Solving / Innovation",
  "Client / Stakeholder Impact",
  "Process Improvement / Efficiency",
  "Mentoring / Knowledge Sharing",
];

const UpdateContribution = ({ contribution, onUpdate, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const initialCategories = Array.isArray(contribution.categories)
    ? contribution.categories
    : JSON.parse(contribution.categories || "[]");

  const [formData, setFormData] = useState({
    title: contribution.title || "",
    what_happened: contribution.what_happened || "",
    why_it_mattered: contribution.why_it_mattered || "",
    outcome_impact: contribution.outcome_impact || "",
    contribution_date: contribution.contribution_date || "",
    categories: initialCategories,
    evidence_link: contribution.evidence_links?.[0]?.url || "",
    current_role: contribution.current_role || "",
    current_company: contribution.current_company || "",
  });

  const [file, setFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(
    contribution.files?.[0] || null,
  );
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, value] };
      } else {
        return {
          ...prev,
          categories: prev.categories.filter((cat) => cat !== value),
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        e.target.value = null;
        return;
      }

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF, JPG, and PNG files are allowed.");
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      setRemoveFile(false);
    }
  };

  const handleRemoveCurrentFile = () => {
    setRemoveFile(true);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplaceClick = () => {
    setRemoveFile(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    if (!formData.current_role.trim()) {
      alert("Please enter your current role.");
      return;
    }

    if (!formData.current_company.trim()) {
      alert("Please enter your current company.");
      return;
    }

    setIsSubmitting(true);
    setStatus("saving");

    try {
      const updateData = new FormData();
      updateData.append("contribution_id", contribution.id);

      if (formData.title !== contribution.title) {
        updateData.append("title", formData.title);
      }
      if (formData.what_happened !== contribution.what_happened) {
        updateData.append("what_happened", formData.what_happened);
      }
      if (formData.why_it_mattered !== contribution.why_it_mattered) {
        updateData.append("why_it_mattered", formData.why_it_mattered);
      }
      if (formData.outcome_impact !== contribution.outcome_impact) {
        updateData.append("outcome_impact", formData.outcome_impact);
      }
      if (formData.contribution_date !== contribution.contribution_date) {
        updateData.append("contribution_date", formData.contribution_date);
      }

      const currentCats = JSON.stringify(formData.categories);
      const originalCats = JSON.stringify(initialCategories);
      if (currentCats !== originalCats) {
        updateData.append("categories", JSON.stringify(formData.categories));
      }

      const newLink = formData.evidence_link.trim();
      const oldLink = contribution.evidence_links?.[0]?.url || "";
      if (newLink !== oldLink) {
        updateData.append("evidence_link", newLink);
      }

      if (formData.current_role !== (contribution.current_role || "")) {
        updateData.append("current_role", formData.current_role);
      }
      if (formData.current_company !== (contribution.current_company || "")) {
        updateData.append("current_company", formData.current_company);
      }

      if (removeFile || file) {
        updateData.append("remove_file", "1");
      }

      if (file) {
        updateData.append("file", file);
      }

      const result = await updateContribution(updateData);

      if (result.status === "success") {
        setStatus("success");
        setTimeout(() => {
          onUpdate(result.contribution);
        }, 1000);
      } else {
        setStatus("error");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Update error:", err);
      setStatus("error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-contribution-form">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1 me-3">
            <h6 className="mb-2">
              <strong>Contribution title:</strong>
            </h6>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="text-end">
            <span className="d-block mb-1 date-label">
              <strong>Contribution date:</strong>
            </span>
            <input
              type="date"
              name="contribution_date"
              className="form-control form-control-sm d-inline-block w-auto"
              value={formData.contribution_date}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
            <span className="logged-label d-block mt-2">
              <strong>Logged:</strong>{" "}
              <span className="date-value">
                {new Date(contribution.created_at).toLocaleDateString()}
              </span>
            </span>
          </div>
        </div>

        <div className="mb-3">
          <h6 className="mb-2">
            <strong>Categories:</strong>
          </h6>
          <div className="category-update-container">
            {CATEGORY_OPTIONS.map((category) => (
              <div key={category} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`cat-${contribution.id}-${category.replace(/\s+/g, "-")}`}
                  value={category}
                  checked={formData.categories.includes(category)}
                  onChange={handleCategoryChange}
                  disabled={isSubmitting}
                />
                <label
                  className="form-check-label"
                  htmlFor={`cat-${contribution.id}-${category.replace(
                    /\s+/g,
                    "-",
                  )}`}
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <h6>
            <strong>What happened:</strong>
          </h6>
          <textarea
            name="what_happened"
            className="form-control"
            rows="3"
            value={formData.what_happened}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <h6>
            <strong>Why it mattered:</strong>
          </h6>
          <textarea
            name="why_it_mattered"
            className="form-control"
            rows="3"
            value={formData.why_it_mattered}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <h6>
            <strong>Outcome & impact:</strong>
          </h6>
          <textarea
            name="outcome_impact"
            className="form-control"
            rows="3"
            value={formData.outcome_impact}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <h6 className="mb-1">
            <strong>Supporting link:</strong>
          </h6>
          <input
            type="url"
            name="evidence_link"
            className="form-control"
            placeholder="https://..."
            value={formData.evidence_link}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <h6 className="mb-1">
            <strong>Supporting file:</strong>
          </h6>

          {currentFile && !removeFile && !file && (
            <div className="current-file-display">
              <span role="img" aria-label="document">
                📄
              </span>{" "}
              {currentFile.file_name}
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={handleReplaceClick}
                  disabled={isSubmitting}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRemoveCurrentFile}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {(removeFile || !currentFile) && (
            <input
              type="file"
              ref={fileInputRef}
              className="form-control"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6 className="mb-1">
              <strong>Current role:</strong>
            </h6>
            <input
              type="text"
              name="current_role"
              className="form-control"
              value={formData.current_role}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., Senior Developer"
            />
          </div>
          <div className="col-md-6">
            <h6 className="mb-1">
              <strong>Current company:</strong>
            </h6>
            <input
              type="text"
              name="current_company"
              className="form-control"
              value={formData.current_company}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., HSBC Bank"
            />
          </div>
        </div>

        <div className="d-flex align-items-center">
          <button
            type="submit"
            className="btn btn-secondary me-2"
            disabled={isSubmitting}
          >
            Save changes
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          {status === "saving" && <small>Saving...</small>}
          {status === "success" && (
            <small className="text-success">Saved successfully.</small>
          )}
          {status === "error" && (
            <small className="text-danger">Error saving.</small>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateContribution;
