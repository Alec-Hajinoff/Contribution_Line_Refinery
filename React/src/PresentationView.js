import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { presentationViewGet } from "./ApiService";
import "./PresentationView.css";

const PresentationView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await presentationViewGet(id);
        if (result.status === "success") {
          setData(result);
        } else {
          throw new Error(result.message || "Failed to load presentation.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const downloadFile = (base64Data, fileName, mimeType) => {
    try {
      if (!base64Data) {
        console.error("No file data available");
        alert("File data is missing");
        return;
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: mimeType || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  if (loading)
    return <div className="text-center mt-5">Loading presentation...</div>;
  if (error) return <div className="alert alert-danger mt-5 m-4">{error}</div>;

  return (
    <div className="presentation-container">
      <header className="presentation-header">
        <h5 className="presentation-title">
          {data.name
            ? `Professional Contribution Summary - ${data.name}`
            : "Professional Contribution Summary"}
        </h5>

        <div className="presentation-metadata">
          <span>Prepared on: {new Date().toLocaleDateString()}</span>
        </div>
      </header>

      <div className="timeline-container">
        {data.contributions.map((item) => (
          <div key={item.id} className="timeline-card card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6>
                    <strong>Contribution title:</strong>
                  </h6>
                  <h3 className="card-title h5">{item.title}</h3>
                </div>
                <div className="text-end">
                  <span className="d-block mb-1 date-info-block">
                    <strong>Contribution date:</strong>{" "}
                    <span className="date-info-value">
                      {new Date(item.contribution_date).toLocaleDateString()}
                    </span>
                  </span>

                  <span className="d-block date-info-block">
                    <strong>Contribution logged:</strong>{" "}
                    <span className="date-info-value">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>

              {item.categories && (
                <div className="mb-3">
                  <h6>
                    <strong>Categories:</strong>
                  </h6>
                  <div>
                    {(Array.isArray(item.categories)
                      ? item.categories
                      : JSON.parse(item.categories || "[]")
                    ).map((cat, idx) => (
                      <span key={idx} className="badge category-badge me-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3">
                <h6>
                  <strong>What happened:</strong>
                </h6>
                <p className="card-text">{item.what_happened}</p>

                <h6>
                  <strong>Why it mattered:</strong>
                </h6>
                <p className="card-text">{item.why_it_mattered}</p>

                <h6>
                  <strong>Outcome & impact:</strong>
                </h6>
                <p className="card-text">{item.outcome_impact}</p>
              </div>

              {item.evidence_links && item.evidence_links.length > 0 && (
                <div className="mt-3">
                  <h6>
                    <strong>Supporting link:</strong>
                  </h6>
                  <ul className="list-unstyled mb-0">
                    {item.evidence_links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none small"
                        >
                          <span role="img" aria-label="link">
                            🔗
                          </span>{" "}
                          {link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.files && item.files.length > 0 && (
                <div className="mt-3">
                  <h6>
                    <strong>Supporting file:</strong>
                  </h6>
                  <div className="d-flex flex-wrap">
                    {item.files.map((file, idx) => (
                      <button
                        key={idx}
                        className="btn btn-link p-0 me-3 text-decoration-none small text-dark d-flex align-items-center file-btn"
                        onClick={() =>
                          downloadFile(
                            file.file_data,
                            file.file_name,
                            file.mime_type,
                          )
                        }
                      >
                        <span role="img" aria-label="document">
                          📄
                        </span>{" "}
                        {file.file_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-2 border-top">
                <div className="d-flex gap-3 small text-muted">
                  {item.current_role && (
                    <span>
                      <strong className="info-label">Current role:</strong>{" "}
                      {item.current_role}
                    </span>
                  )}
                  {item.current_company && (
                    <span>
                      <strong className="info-label">Current company:</strong>{" "}
                      {item.current_company}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 mb-5 d-print-none">
        <button
          className="btn btn-secondary px-4 shadow-sm"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default PresentationView;
