import React from "react";
import "./TechnologyStack.css";
import reactLogo from "./Images/react_light.svg";
import bootstrapLogo from "./Images/bootstrap.svg";
import cssLogo from "./Images/css_old.svg";
import htmlLogo from "./Images/html5.svg";
import jsLogo from "./Images/javascript.svg";
import mysqlLogo from "./Images/mysql-wordmark-light.svg";
import phpLogo from "./Images/php.svg";
import affinityDesignerLogo from "./Images/affinity_designer.svg";

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
        { name: "Affinity Designer", logo: affinityDesignerLogo },
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
