import React from "react";
import "./Main.css";

function Main() {
  const valuePoints = [
    {
      id: 1,
      icon: "📋",
      title: "Private Record",
      description:
        "Capture contributions in a secure, private system of record that you own and control.",
    },
    {
      id: 2,
      icon: "⏱️",
      title: "Capture As It Happens",
      description:
        "Log meaningful contributions at the moment the work occurs, while context is fresh.",
    },
    {
      id: 3,
      icon: "🎯",
      title: "Flexible Views",
      description:
        "Assemble custom views for different purposes—promotions, reviews, pay negotiations—without duplicating work.",
    },
    {
      id: 4,
      icon: "📊",
      title: "Evidence-Based",
      description:
        "Ground conversations in factual, well-organized evidence rather than ad-hoc memory or recent activity.",
    },
    {
      id: 5,
      icon: "🚀",
      title: "Portable & Independent",
      description:
        "Your contributions belong to you. Records are portable and persist independently of any employer.",
    },
    {
      id: 6,
      icon: "✅",
      title: "Always Prepared",
      description:
        "Maintain an up-to-date record so you're never reconstructing your value at the last minute.",
    },
  ];

  return (
    <div className="main-container">
      <div className="intro-section">
        <h6 className="intro-headline">
          Capture your real work contributions as they happen - so you can
          clearly demonstrate your value at review time.
        </h6>
      </div>

      <div className="value-points-section">
        <div className="row">
          {valuePoints.map((point) => (
            <div key={point.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="value-card">
                <div className="card-icon">{point.icon}</div>
                <h4 className="card-title">{point.title}</h4>
                <p className="card-description">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
