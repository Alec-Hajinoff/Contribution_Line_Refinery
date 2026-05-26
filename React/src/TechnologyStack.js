import React from "react";
import "./TechnologyStack.css";
import reactLogo from "./react_light.svg";
import bootstrapLogo from "./bootstrap.svg";
import cssLogo from "./css_old.svg";
import htmlLogo from "./html5.svg";
import jsLogo from "./javascript.svg";
import mysqlLogo from "./mysql-wordmark-light.svg";
import phpLogo from "./php.svg";

function TechnologyStack() {
  const techCategories = [
    {
      category: "Frontend",
      items: [
        { name: "HTML5", logo: htmlLogo },
        { name: "CSS", logo: cssLogo },
        { name: "JavaScript", logo: jsLogo },
        { name: "React", logo: reactLogo },
        { name: "Bootstrap", logo: bootstrapLogo },
      ],
    },
    {
      category: "Backend",
      items: [{ name: "PHP", logo: phpLogo }],
    },
    {
      category: "Database",
      items: [{ name: "MySQL", logo: mysqlLogo }],
    },
  ];

  return (
    <div className="tech-stack-container">
      <h5 className="tech-stack-title">Technology stack</h5>

      <div className="tech-categories-wrapper">
        {techCategories.map((group) => (
          <div key={group.category} className="tech-category-group">
            <span className="tech-category-label">{group.category}:</span>
            <div className="tech-stack-grid">
              {group.items.map((tech) => (
                <div key={tech.name} className="tech-item">
                  <div className="tech-icon-wrapper">
                    <img src={tech.logo} alt={`${tech.name} Logo`} />
                  </div>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnologyStack;
