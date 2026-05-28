import React from "react";
import "./Certifications.css";

function Certifications() {
  const certificationsList = [
    {
      name: "React",
      path: "/Certifications/Completion_Certificate_Learn_React.pdf",
    },
  ];

  return (
    <div className="certifications-container">
      <h2 className="h5 mt-4">Certifications</h2>
      <ul className="certifications-list">
        {certificationsList.map((cert, index) => (
          <li key={index}>
            <a
              href={cert.path}
              target="_blank"
              rel="noopener noreferrer"
              className="certification-link"
            >
              {cert.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Certifications;
