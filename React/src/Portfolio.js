import React from "react";
import "./Portfolio.css";

import trainingApiLogo from "./Images/trainingapi_logo.png";

function Portfolio() {
  return (
    <div className="portfolio-container container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <section className="hero">
            <h2 className="hero-title">A practical overview of recent work</h2>
          </section>

          <div className="clearfix-custom">
            <div className="logo-container rounded">
              <a
                href="https://trainingapi.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={trainingApiLogo}
                  alt="TrainingApi Logo"
                  className="portfolio-logo img-fluid"
                />
              </a>
            </div>

            <h2 className="h5 mt-4">1. Business Purpose</h2>
            <p>
              <a
                href="https://trainingapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                TrainingApi<span className="external-icon">&#x2197;</span>
              </a>{" "}
              is a platform for delivering virtual instructor‑led technology
              workshops, helping organisations rapidly develop practical skills
              and adopt new tools.
            </p>
            <p>
              It provides a structured catalogue of upcoming sessions, enabling
              training managers to discover programmes, compare options, and
              submit enquiries directly through the platform.
            </p>

            <h2 className="h5 mt-4">2. My Role</h2>
            <p>I designed and built the system end‑to‑end.</p>
            <p>
              The current MVP demonstrates the feasibility of aggregating,
              standardising, and delivering virtual workshops through a unified,
              accessible interface for both organisations and training
              providers.
            </p>

            <h2 className="h5 mt-4">3. Technical Highlights</h2>
            <p>
              The platform uses a React frontend, PHP backend, and MySQL
              database, built around an API‑first architecture that supports
              both the internal UI and external integrations with corporate
              Learning Management Systems (LMS).
            </p>
            <p>
              This approach enables data ingestion from external providers and
              allows non‑technical users—such as training managers—to interact
              with the system through a clean, UI‑driven workflow.
            </p>

            <h2 className="h5 mt-4">4. Key Features</h2>
            <ul>
              <li>
                <strong>Structured catalogue</strong> - of instructor‑led
                virtual workshops with detailed metadata
              </li>
              <li>
                <strong>Display options</strong> - chronological or card‑based
                display of upcoming sessions
              </li>
              <li>
                <strong>Skill‑gap requests</strong> - submission when no
                suitable programme exists
              </li>
              <li>
                <strong>Data export</strong> - CSV export of workshop
                information
              </li>
              <li>
                <strong>LMS integration</strong> - standardised API access for
                organisations and LMS systems
              </li>
              <li>
                <strong>Administrative interface</strong> - for providers, with
                platform‑level review to ensure consistency and quality
              </li>
            </ul>

            <h2 className="h5 mt-4">5. Outcome</h2>
            <p>For Organisations & Training Managers</p>
            <ul>
              <li>
                <strong>Immediate access</strong> - to a curated catalogue of
                practical, instructor‑led workshops
              </li>
              <li>
                <strong>Custom requests</strong> - ability to request custom
                programmes aligned to specific skill gaps
              </li>
              <li>
                <strong>Automation</strong> - optional LMS integration for
                automated data flow
              </li>
            </ul>

            <p>For Training Providers</p>
            <ul>
              <li>
                <strong>Streamlined delivery</strong> - to organisations seeking
                practical technology training
              </li>
              <li>
                <strong>Reduced overhead</strong> - reduced administrative
                overhead through standardised programme submission and review
              </li>
            </ul>

            <p className="github-inspection-block">
              Interested in the implementation details?{" "}
              <a
                href="https://github.com/yourusername/trainingapi-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Browse code on GitHub
                <span className="external-icon">&#x2197;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
