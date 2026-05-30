import React from "react";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 clearfix-custom">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>

          <h2 className="h5 mt-4">1. Introduction</h2>
          <p>
            Hertford Standard (“we”, “us”, or “our”) is committed to protecting
            and respecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard personal data when you use our web
            application, including the public website, client dashboard, and
            administrative systems. We process personal data in accordance with
            the UK General Data Protection Regulation (UK GDPR) and the Data
            Protection Act 2018.
          </p>

          <h2 className="h5 mt-4">2. Data Controller</h2>
          <p>
            Hertford Standard acts as the data controller for the personal data
            collected through this application. If you have any questions about
            this policy or your data, please contact us using our email address.
          </p>

          <h2 className="h5 mt-4">3. Personal Data We Collect</h2>
          <p>
            We may collect and process the following categories of personal
            data:
          </p>

          <h2 className="h5 mt-4">3.1 Information You Provide</h2>
          <ul>
            <li>Name and contact details (e.g. email address)</li>
            <li>Account registration details</li>
            <li>Project enquiry and specification information</li>
            <li>Communications and correspondence</li>
          </ul>

          <h2 className="h5 mt-4">3.2 Technical Data</h2>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device and operating system information</li>
            <li>Usage data (e.g. pages visited, actions taken)</li>
          </ul>

          <h2 className="h5 mt-4">3.3 Client Project Data</h2>
          <p>
            Project requirements, documentation, and updates submitted through
            the client dashboard.
          </p>

          <h2 className="h5 mt-4">4. How We Use Your Data</h2>
          <p>We use personal data for the following purposes:</p>
          <ul>
            <li>
              To respond to enquiries and communicate with prospective clients
            </li>
            <li>To provide and manage client accounts</li>
            <li>To deliver and manage projects</li>
            <li>To maintain and improve the application</li>
            <li>To ensure security and prevent unauthorised access</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="h5 mt-4">5. Lawful Basis for Processing</h2>
          <p>We rely on the following lawful bases under UK GDPR:</p>
          <ul>
            <li>
              <strong>Contractual necessity</strong> – to provide services
              requested by you
            </li>
            <li>
              <strong>Legitimate interests</strong> – to operate, improve, and
              secure the application
            </li>
            <li>
              <strong>Legal obligation</strong> – where processing is required
              by law
            </li>
            <li>
              <strong>Consent</strong> – where explicitly obtained (e.g.
              optional communications)
            </li>
          </ul>

          <h2 className="h5 mt-4">6. Data Sharing</h2>
          <p>We do not sell or rent personal data. We may share data with:</p>
          <ul>
            <li>
              Service providers supporting hosting, infrastructure, or
              application functionality
            </li>
            <li>Professional advisers where necessary</li>
            <li>Authorities where required by law</li>
          </ul>
          <p>
            All third parties are required to respect the security and
            confidentiality of your data.
          </p>

          <h2 className="h5 mt-4">7. Data Storage and Security</h2>
          <p>
            Your data is stored securely using appropriate technical and
            organisational measures, including:
          </p>
          <ul>
            <li>Secure server environments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>
              Separation of application layers (frontend, backend, database)
            </li>
          </ul>
          <p>
            We take reasonable steps to protect data from unauthorised access,
            alteration, or disclosure.
          </p>

          <h2 className="h5 mt-4">8. Data Retention</h2>
          <p>We retain personal data only for as long as necessary to:</p>
          <ul>
            <li>Fulfil the purposes for which it was collected</li>
            <li>Comply with legal and regulatory obligations</li>
            <li>Resolve disputes and enforce agreements</li>
          </ul>
          <p>
            Client project data may be retained for operational and
            record-keeping purposes unless deletion is requested and legally
            permissible.
          </p>

          <h2 className="h5 mt-4">9. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to processing</li>
            <li>Request data portability (where applicable)</li>
          </ul>
          <p>
            To exercise your rights, please contact us using our contact email
            address. You also have the right to lodge a complaint with the
            Information Commissioner’s Office (ICO).
          </p>

          <h2 className="h5 mt-4">10. Cookies</h2>
          <p>The application may use cookies or similar technologies to:</p>
          <ul>
            <li>Maintain session functionality</li>
            <li>Improve user experience</li>
            <li>Analyse usage patterns</li>
          </ul>
          <p>
            You can control cookie preferences through your browser settings.
          </p>

          <h2 className="h5 mt-4">11. International Transfers</h2>
          <p>
            We do not intentionally transfer personal data outside the UK. If
            this becomes necessary, appropriate safeguards will be implemented
            in accordance with UK GDPR.
          </p>

          <h2 className="h5 mt-4">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
