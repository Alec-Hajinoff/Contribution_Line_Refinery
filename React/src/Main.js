import React from "react";
import "./Main.css";

function Main() {
  return (
    <div className="main-container">
      <div className="intro-section">
        <h2 className="intro-headline">
          Making external data reliable and ready to use
        </h2>
        <p className="intro-text">
          Contribution Line is an early-stage platform focused on turning
          fragmented, real-world data into structured, usable data products.
        </p>
        <p className="intro-text">
          We work with data suppliers to collect raw datasets, apply validation
          checks to improve quality and consistency, and make the data easier to
          integrate into business workflows via API or downloads.
        </p>
      </div>

      <div className="status-section">
        <h2 className="section-title">Status</h2>
        <p className="status-intro">
          We are currently in development and speaking with organisations
          interested in:
        </p>
        <ul className="status-list">
          <li>accessing more reliable external data</li>
          <li>contributing datasets as suppliers</li>
        </ul>
        <p className="status-closing">
          If this is relevant to you, please email us - we would be glad to
          connect.
        </p>
      </div>
    </div>
  );
}

export default Main;
