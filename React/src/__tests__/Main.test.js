import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Main from "../Main";

jest.mock("../ContactForm", () => () => (
  <div data-testid="mock-contact-form">Mocked Contact Form Interface</div>
));

describe("Main Component Layout and Structural Tests", () => {
  test("renders the structural container with correct styling hooks", () => {
    const { container } = render(<Main />);

    const outerContainer = container.querySelector(".main-container");
    const introSection = container.querySelector(".intro-section");

    expect(outerContainer).toBeInTheDocument();
    expect(introSection).toBeInTheDocument();
  });

  test("renders the headline portfolio introduction copy and company mission messaging text", () => {
    render(<Main />);

    const heroHeading = screen.getByRole("heading", { level: 2 });
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading).toHaveClass("hero-title");
    expect(heroHeading).toHaveTextContent(
      "I build modern and secure web applications for businesses and development teams",
    );

    const introductoryParagraph = screen.getByText(
      /Hertford Standard is a portfolio and client‑management application/i,
    );
    expect(introductoryParagraph).toBeInTheDocument();
    expect(introductoryParagraph).toHaveClass("intro-text");
  });

  test("mounts the standalone child ContactForm component inside the introduction layout panel", () => {
    render(<Main />);

    const contactFormBoundary = screen.getByTestId("mock-contact-form");
    expect(contactFormBoundary).toBeInTheDocument();
    expect(contactFormBoundary).toHaveTextContent(
      "Mocked Contact Form Interface",
    );
  });
});
