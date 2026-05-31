import React from "react";
import "./TermsOfService.css";

function TermsOfService() {
  return (
    <div className="terms-container">
      <div className="container">
        <h1>Terms of Service</h1>
        <p>
          <em>Effective Date: {new Date().toLocaleDateString()}</em>
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          This is a placeholder for the Terms of Service. Here you will outline
          the rules and guidelines users must agree to when using your
          application.
        </p>

        <h2>2. User Responsibilities</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>

        <h2>5. Governing Law</h2>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us
          at:
          <br />
          <a href="mailto:alec@hertfordstandard.com">
            alec@hertfordstandard.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
