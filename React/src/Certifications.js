import React from "react";
import "./Certifications.css";

import { ReactComponent as CertificationIcon } from "./certification_icon.svg";

function Certifications() {
  const certificationsList = [
    {
      name: "Full Stack Engineering",
      path: "/Certifications/Completion_Certificate_Full_Stack_Engineering.pdf",
    },
    {
      name: "PHP",
      path: "/Certifications/Completion_Certificate_PHP.pdf",
    },
    {
      name: "Python",
      path: "/Certifications/Completion_Certificate_Python_3.pdf",
    },
    {
      name: "React",
      path: "/Certifications/Completion_Certificate_Learn_React.pdf",
    },
    {
      name: "jQuery",
      path: "/Certifications/Completion_Certificate_jQuery.pdf",
    },
    {
      name: "Bootstrap",
      path: "/Certifications/Completion_Certificate_Learn_Bootstrap.pdf",
    },
  ];

  return (
    <div className="certifications-container">
      <h2 className="h5 mt-4">Certifications</h2>

      <div className="certifications-list-horizontal">
        {certificationsList.map((cert, index) => (
          <React.Fragment key={index}>
            {index > 0 && <CertificationIcon className="certification-icon" />}

            <p className="certification-item">
              <a
                href={cert.path}
                target="_blank"
                rel="noopener noreferrer"
                className="certification-link"
              >
                {cert.name}
              </a>
            </p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Certifications;
