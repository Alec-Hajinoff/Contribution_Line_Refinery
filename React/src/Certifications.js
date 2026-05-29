import React from "react";
import "./Certifications.css";

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
