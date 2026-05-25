import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const user = ["a", "l", "e", "c"].join("");
  const domain = ["hertfordstandard", "com"].join(".");
  const email = `${user}@${domain}`;
  return (
    <div className="container text-center">
      <br />
      <div className="row">
        <div className="col-12">
          <p className="footer">
            <em>
              &copy; Copyright 2025 - {currentYear}. Office address: 4 Bridge
              Gate, London, N21 2AH, United Kingdom. Email address:{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </em>
          </p>
          <div className="footer-links">
            <Link to="/Privacypolicy" className="footer-link">
              Privacy Policy
            </Link>
            <span className="footer-separator">|</span>
            <Link to="/Termsofservice" className="footer-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
