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
            <li>
              <strong>Name and contact details (e.g. email address)</strong>
            </li>
            <li>
              <strong>
                Account registration details for application access
              </strong>
            </li>
            <li>
              <strong>
                Project enquiry and specification information submitted by
                prospective clients
              </strong>
            </li>
            <li>
              <strong>
                Communications and correspondence sent via our contact channels
              </strong>
            </li>
          </ul>

          <h2 className="h5 mt-4">3.2 Technical Data</h2>
          <ul>
            <li>
              <strong>IP address, network identifiers</strong>
            </li>
            <li>
              <strong>
                Browser type and version, application compatibility data
              </strong>
            </li>
            <li>
              <strong>
                Device and operating system information, hardware
                characteristics
              </strong>
            </li>
            <li>
              <strong>Usage data (e.g. pages visited, actions taken)</strong>
            </li>
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
              <strong>
                To respond to enquiries and communicate with prospective clients
              </strong>
            </li>
            <li>
              <strong>To provide and manage client accounts</strong>
            </li>
            <li>
              <strong>To deliver and manage projects</strong>
            </li>
            <li>
              <strong>To maintain and improve the application</strong>
            </li>
            <li>
              <strong>
                To ensure security and prevent unauthorised access
              </strong>
            </li>
            <li>
              <strong>To comply with legal obligations</strong>
            </li>
          </ul>

          <h2 className="h5 mt-4">5. Lawful Basis for Processing</h2>
          <p>We rely on the following lawful bases under UK GDPR:</p>
          <ul>
            <li>
              <strong>
                Contractual necessity to provide services requested by you
              </strong>
            </li>
            <li>
              <strong>
                Legitimate interests to operate, improve, and secure the
                application
              </strong>
            </li>
            <li>
              <strong>
                Legal obligation where processing is required by law
              </strong>
            </li>
            <li>
              <strong>
                Consent where explicitly obtained (e.g. optional communications)
              </strong>
            </li>
          </ul>

          <h2 className="h5 mt-4">6. Data Sharing</h2>
          <p>We do not sell or rent personal data. We may share data with:</p>
          <ul>
            <li>
              <strong>
                Service providers supporting hosting, infrastructure, or
                application functionality
              </strong>
            </li>
            <li>
              <strong>Professional advisers where necessary</strong>
            </li>
            <li>
              <strong>Authorities where required by law</strong>
            </li>
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
            <li>
              <strong>
                Secure server environments protecting infrastructure
              </strong>
            </li>
            <li>
              <strong>Access controls and authentication mechanisms</strong>
            </li>
            <li>
              <strong>
                Separation of application layers - frontend, backend, database
              </strong>
            </li>
          </ul>
          <p>
            We take reasonable steps to protect data from unauthorised access,
            alteration, or disclosure.
          </p>

          <h2 className="h5 mt-4">8. Data Retention</h2>
          <p>We retain personal data only for as long as necessary to:</p>
          <ul>
            <li>
              <strong>Fulfil the purposes for which it was collected</strong>
            </li>
            <li>
              <strong>Comply with legal and regulatory obligations</strong>
            </li>
            <li>
              <strong>Resolve disputes and enforce agreements</strong>
            </li>
          </ul>
          <p>
            Client project data may be retained for operational and
            record-keeping purposes unless deletion is requested and legally
            permissible.
          </p>

          <h2 className="h5 mt-4">9. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>
              <strong>Access your personal data</strong>
            </li>
            <li>
              <strong>Request correction of inaccurate data</strong>
            </li>
            <li>
              <strong>Request deletion of your data</strong>
            </li>
            <li>
              <strong>Restrict or object to processing</strong>
            </li>
            <li>
              <strong>Request data portability where applicable</strong>
            </li>
          </ul>
          <p>
            To exercise your rights, please contact us using our contact email
            address. You also have the right to lodge a complaint with the
            Information Commissioner's Office (ICO).
          </p>

          <h2 className="h5 mt-4">10. Cookies</h2>
          <p>The application may use cookies or similar technologies to:</p>
          <ul>
            <li>
              <strong>Maintain session functionality</strong>
            </li>
            <li>
              <strong>Improve user experience</strong>
            </li>
            <li>
              <strong>Analyse usage patterns</strong>
            </li>
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
