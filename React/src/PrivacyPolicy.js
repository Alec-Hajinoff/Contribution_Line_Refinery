import React from "react";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>
          <em>Last updated: {new Date().toLocaleDateString()}</em>
        </p>

        <h2>1. Introduction</h2>
        <p>
          This is a placeholder for the Privacy Policy. Here you will outline
          how your company collects, uses, and protects user data.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>

        <h2>4. Data Security</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:alec@hertfordstandard.com">
            alec@hertfordstandard.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
