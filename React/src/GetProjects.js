import React, { useState, useEffect } from "react";
import { getProjects } from "./ApiService";
import "./GetProjects.css";

const GetProjects = ({ refreshTrigger }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProjects();
      if (result.success) {
        setProjects(result.projects);
      } else {
        setError(result.message || "Failed to load projects.");
      }
    } catch (err) {
      setError("Unable to fetch your projects. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (projectId) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="get-projects-container">
        <div className="text-center py-4">
          <div
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading your projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="get-projects-container">
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(null)}
          ></button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="get-projects-container">
        <div className="text-center py-5">
          <i
            className="bi bi-folder2-open"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
          <p className="text-muted mt-2 mb-0">Your projects will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="get-projects-container">
      <h4 className="mb-3">My Projects</h4>
      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item card mb-2">
            <div
              className="project-header card-body py-3 px-4"
              onClick={() => toggleProject(project.id)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <span className="project-toggle-icon">
                    {expandedProjectId === project.id ? "▼" : "▶"}
                  </span>
                  <h5 className="project-title mb-0">{project.title}</h5>
                </div>
                <div className="d-flex gap-3 align-items-center">
                  <span
                    className={`project-status status-${project.status.toLowerCase()}`}
                  >
                    {project.status === "in_progress"
                      ? "In progress"
                      : "Completed"}
                  </span>
                  <span className="project-date text-muted small">
                    {formatDate(project.created_at)}
                  </span>
                </div>
              </div>
            </div>
            {expandedProjectId === project.id && (
              <div className="project-body card-footer bg-white px-4 py-3">
                <p className="text-muted mb-0 small">
                  Click to expand - timeline coming soon
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetProjects;
