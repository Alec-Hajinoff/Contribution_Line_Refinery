import React from "react";
import "./Main.css";
import ContactForm from "./ContactForm";

function Main() {
  return (
    <div className="main-container">
      <section className="hero">
        <h2 className="hero-title">
          I build modern and secure web applications for businesses and
          development teams
        </h2>
      </section>

      <div className="intro-section">
        <p className="intro-text">
          Hertford Standard is a portfolio and client‑management application
          designed to showcase my capabilities as a software engineer.
        </p>

        <ContactForm />
      </div>
    </div>
  );
}

export default Main;
