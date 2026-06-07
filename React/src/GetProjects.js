import React, { useState, useEffect } from "react";
import { getProjects } from "./ApiService";
import "./GetProjects.css";
import ProjectMessages from "./ProjectMessages";
import ProjectTimeline from "./ProjectTimeline";
import StatusUpdate from "./StatusUpdate";

const GetProjects = ({ refreshTrigger, isAdminView = false }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [timelineRefreshTrigger, setTimelineRefreshTrigger] = useState(0);

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
        setError(
          result.message ||
            "We weren’t able to load your projects at the moment. Please try again shortly.",
        );
      }
    } catch (err) {
      setError(
        "We’re sorry, but we couldn’t retrieve your projects right now. Please try again in a few moments.",
      );
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

  const formatDescription = (description) => {
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const handleStatusUpdated = (projectId, newStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project,
      ),
    );
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
          <span>Loading projects...</span>
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
          <p className="mt-2 mb-0">Your projects will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="get-projects-container">
      <div className="get-projects-header text-center">
        <h4>{isAdminView ? "All Projects" : "My Projects"}</h4>
      </div>
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
                  <span className="project-date text-muted">
                    {formatDate(project.created_at)}
                  </span>
                </div>
              </div>
            </div>
            {expandedProjectId === project.id && (
              <div className="project-body card-footer bg-white px-4 py-3">
                {isAdminView && (
                  <div className="mb-2 pb-3 border-bottom">
                    <strong className="text-muted">Client:</strong>
                    <span className="ms-2">{project.client_name}</span>
                  </div>
                )}

                {isAdminView && (
                  <StatusUpdate
                    projectId={project.id}
                    currentStatus={project.status}
                    onStatusUpdated={handleStatusUpdated}
                  />
                )}

                <div className="mb-3">
                  <strong className="text-muted">Project brief:</strong>
                  <div className="project-description mt-4 mb-4">
                    {formatDescription(project.description)}
                  </div>
                </div>

                <div>
                  <strong className="text-muted ">Attachments:</strong>
                  {project.attachments && project.attachments.length > 0 ? (
                    <ul className="attachment-list mt-4 mb-4">
                      {project.attachments.map((attachment) => (
                        <li key={attachment.id} className="attachment-item">
                          <i className="bi bi-paperclip me-1"></i>
                          {attachment.attachment_name}
                          <span className="attachment-links ms-4">
                            <a
                              href={attachment.view_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-link p-0 me-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                              <span className="project-external-icon">
                                &#x2197;
                              </span>
                            </a>
                            <a
                              href={attachment.download_url}
                              download
                              className="btn btn-link p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Download
                              <span className="project-external-icon">
                                &#x2197;
                              </span>
                            </a>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 mb-4">No attachments uploaded</p>
                  )}
                </div>

                <ProjectMessages
                  projectId={project.id}
                  onMessageSubmitted={() => {
                    fetchProjects();
                    setTimelineRefreshTrigger((prev) => prev + 1);
                  }}
                />

                <ProjectTimeline
                  projectId={project.id}
                  refreshTrigger={timelineRefreshTrigger}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetProjects;
