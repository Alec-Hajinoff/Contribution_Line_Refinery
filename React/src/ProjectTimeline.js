import React, { useState, useEffect } from "react";
import { projectTimeline } from "./ApiService";
import "./ProjectTimeline.css";

const ProjectTimeline = ({ projectId, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [projectId, refreshTrigger]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectTimeline(projectId);
      if (result.success) {
        setMessages(result.messages);
      } else {
        setError(result.message || "Failed to load messages.");
      }
    } catch (err) {
      setError("Unable to fetch project messages. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessage = (message) => {
    return message.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="project-timeline-container">
        <div className="text-center py-3">
          <div
            className="spinner-border spinner-border-sm text-primary me-2"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="small">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-timeline-container">
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

  if (messages.length === 0) {
    return (
      <div className="project-timeline-container">
        <div className="text-center py-4">
          <p className="mt-2 mb-0">No updates or requests yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-timeline-container">
      <div className="timeline-card-header">
        <h5>Project Updates</h5>
      </div>
      <div className="timeline">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`timeline-item ${index === 0 ? "latest" : ""}`}
          >
            <div className="timeline-badge">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <strong className="timeline-author">
                  {message.author_name}
                </strong>
                <span className="timeline-date text-muted">
                  {formatDate(message.created_at)}
                </span>
              </div>
              <div className="timeline-message">
                {formatMessage(message.message)}
              </div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="timeline-attachments mt-2">
                  <div>Attachments:</div>
                  <ul className="attachment-list mt-1 mb-0">
                    {message.attachments.map((attachment) => (
                      <li key={attachment.id} className="attachment-item">
                        <i className="bi bi-paperclip me-1"></i>
                        {attachment.attachment_name}
                        <span className="attachment-links ms-2">
                          <a
                            href={attachment.view_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-link btn-sm p-0 me-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                          <a
                            href={attachment.download_url}
                            download
                            className="btn btn-link btn-sm p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Download
                          </a>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;
