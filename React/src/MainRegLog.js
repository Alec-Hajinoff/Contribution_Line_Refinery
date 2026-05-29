import React, { useState, useEffect, useRef } from "react";
import "./MainRegLog.css";
import Main from "./Main.js";
import UserRegistration from "./UserRegistration.js";
import UserLogin from "./UserLogin.js";
import TechnologyStack from "./TechnologyStack.js";

function MainRegLog() {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const toggleTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12 col-md-9">
          <Main />
          <TechnologyStack />
        </div>

        <div className="col-12 col-md-3 sticky-sidebar">
          <p className="section-divider">
            New client? Please register:
            <span className="custom-tooltip-wrapper" ref={tooltipRef}>
              <button
                type="button"
                className="tooltip-btn"
                onClick={toggleTooltip}
                aria-label="Help information"
              >
                <sup>?</sup>
              </button>
              {showTooltip && (
                <span className="custom-tooltip-content">
                  Registered users can submit requirements with text and files,
                  request changes as work progresses, and track every update
                  through a clear, chronological timeline.
                </span>
              )}
            </span>
          </p>
          <UserRegistration />
          <p className="section-divider">Existing client? Please login:</p>
          <UserLogin />
        </div>
      </div>
    </div>
  );
}

export default MainRegLog;
