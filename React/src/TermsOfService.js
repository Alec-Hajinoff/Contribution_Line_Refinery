import React from "react";
import "./TermsOfService.css";

function TermsOfService() {
  return (
    <div className="tos-container container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 clearfix-custom">
          <h1 className="tos-main-title h5">Terms of Service</h1>
          <p className="tos-text">
            Effective Date: {new Date().toLocaleDateString("en-GB")}
          </p>

          <h2 className="tos-heading h5 mt-4">1. Introduction</h2>
          <p className="tos-text">
            These Terms of Service (“Terms”) govern your use of the Hertford
            Standard web application, including the public website, client
            dashboard, and administrative systems (the “Application”).
          </p>
          <p className="tos-text">
            By accessing or using the Application, you agree to be bound by
            these Terms.
          </p>
          <p className="tos-text">
            If you do not agree, you should not use the Application.
          </p>

          <h2 className="tos-heading h5 mt-4">2. About Hertford Standard</h2>
          <p className="tos-text">
            Hertford Standard (“we”, “us”, or “our”) provides a professional
            portfolio and client-management platform designed to:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>
                Present software development services and capabilities
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>Facilitate communication with prospective clients</strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Enable the submission, management, and tracking of client
                projects
              </strong>
            </li>
          </ul>

          <h2 className="tos-heading h5 mt-4">
            3. Eligibility and Acceptable Use
          </h2>
          <p className="tos-text">
            You agree to use the Application only for lawful purposes and in
            accordance with these Terms. You must not:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>
                Use the Application in any way that breaches applicable laws or
                regulations
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Attempt to gain unauthorised access to systems, accounts, or
                data
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Interfere with the security, integrity, or performance of the
                Application
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>Submit false, misleading, or harmful information</strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Upload or transmit malicious code or harmful content
              </strong>
            </li>
          </ul>
          <p className="tos-text">
            We reserve the right to suspend or restrict access where misuse is
            identified.
          </p>

          <h2 className="tos-heading h5 mt-4">4. Accounts and Access</h2>
          <p className="tos-text">
            Certain features require account registration. You are responsible
            for:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>
                Maintaining the confidentiality of your login credentials
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Ensuring that all information you provide is accurate and up to
                date
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>All activity carried out under your account</strong>
            </li>
          </ul>
          <p className="tos-text">
            We may suspend or terminate accounts where there is a breach of
            these Terms or a security concern.
          </p>

          <h2 className="tos-heading h5 mt-4">
            5. Services and Project Engagement
          </h2>
          <p className="tos-text">
            The Application facilitates initial engagement and project
            management but does not, in itself, constitute a binding contract
            for services.
          </p>
          <p className="tos-text">
            Any software development work, timelines, deliverables, and fees
            will be agreed separately in writing between you and Hertford
            Standard.
          </p>
          <p className="tos-text">
            Project timelines and updates displayed in the client dashboard are
            indicative and may be subject to change.
          </p>

          <h2 className="tos-heading h5 mt-4">6. Intellectual Property</h2>
          <p className="tos-text">
            All content within the Application, including text, design,
            branding, and code (excluding client-submitted materials), is owned
            by or licensed to Hertford Standard and is protected by intellectual
            property laws.
          </p>
          <p className="tos-text">You may not:</p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>
                Copy, reproduce, or distribute any part of the Application
                without permission
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Reverse engineer or attempt to extract source code
              </strong>
            </li>
          </ul>
          <p className="tos-text">
            Client-submitted materials remain the property of the client or
            their licensors.
          </p>
          <p className="tos-text">
            By submitting content, you grant us a limited licence to use it for
            the purpose of delivering services.
          </p>

          <h2 className="tos-heading h5 mt-4">7. Data and Content</h2>
          <p className="tos-text">
            You are responsible for the accuracy and legality of any information
            or materials you submit.
          </p>
          <p className="tos-text">
            We reserve the right to remove or restrict content that:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>Violates these Terms</strong>
            </li>
            <li className="tos-list-item">
              <strong>Is unlawful or inappropriate</strong>
            </li>
            <li className="tos-list-item">
              <strong>Poses a security or operational risk</strong>
            </li>
          </ul>

          <h2 className="tos-heading h5 mt-4">8. Availability and Changes</h2>
          <p className="tos-text">
            We aim to ensure the Application is available and functioning
            reliably, but we do not guarantee uninterrupted or error-free
            access.
          </p>
          <p className="tos-text">We may:</p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>
                Modify, suspend, or discontinue any part of the Application
              </strong>
            </li>
            <li className="tos-list-item">
              <strong>Update features, functionality, or content</strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Perform maintenance that may temporarily affect availability
              </strong>
            </li>
          </ul>

          <h2 className="tos-heading h5 mt-4">9. Limitation of Liability</h2>
          <p className="tos-text">To the fullest extent permitted by UK law:</p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>The Application is provided on an “as is” basis</strong>
            </li>
            <li className="tos-list-item">
              <strong>
                We do not guarantee that it will meet all user requirements or
                be free from defects
              </strong>
            </li>
          </ul>
          <p className="tos-text">We are not liable for:</p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>Any indirect, incidental, or consequential losses</strong>
            </li>
            <li className="tos-list-item">
              <strong>
                Loss of business, revenue, or data arising from use of the
                Application
              </strong>
            </li>
          </ul>
          <p className="tos-text">
            Nothing in these Terms excludes or limits liability where it would
            be unlawful to do so, including liability for death or personal
            injury caused by negligence or fraud.
          </p>

          <h2 className="tos-heading h5 mt-4">10. Termination</h2>
          <p className="tos-text">
            We may suspend or terminate your access to the Application at any
            time where:
          </p>
          <ul className="tos-list">
            <li className="tos-list-item">
              <strong>You breach these Terms</strong>
            </li>
            <li className="tos-list-item">
              <strong>Continued access poses a security or legal risk</strong>
            </li>
          </ul>
          <p className="tos-text">
            You may stop using the Application at any time. Termination does not
            affect any rights or obligations accrued prior to termination.
          </p>

          <h2 className="tos-heading h5 mt-4">11. Privacy</h2>
          <p className="tos-text">
            Your use of the Application is also governed by our Privacy Policy,
            which explains how personal data is collected and processed.
          </p>

          <h2 className="tos-heading h5 mt-4">12. Governing Law</h2>
          <p className="tos-text">
            These Terms are governed by and construed in accordance with the
            laws of England and Wales.
          </p>
          <p className="tos-text">
            Any disputes arising in connection with these Terms shall be subject
            to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="tos-heading h5 mt-4">13. Changes to These Terms</h2>
          <p className="tos-text">
            We may update these Terms from time to time. Updated versions will
            be posted on this page.
          </p>
          <p className="tos-text">
            Continued use of the Application after changes take effect
            constitutes acceptance of the updated Terms.
          </p>

          <h2 className="tos-heading h5 mt-4">14. Contact</h2>
          <p className="tos-text">
            If you have any questions about these Terms, please contact us using
            our email address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
