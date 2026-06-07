import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMe from "../AboutMe";

jest.mock("../Certifications", () => {
  return function DummyCertifications() {
    return (
      <div data-testid="mock-certifications">
        Mocked Certifications Component
      </div>
    );
  };
});

describe("AboutMe Component Tests", () => {
  test("renders Alec's profile photo with the correct alt text and class", () => {
    render(<AboutMe />);

    const profileImg = screen.getByRole("img", { name: /alec hajinoff/i });

    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveClass("aboutme-photo", "img-fluid");
  });

  test("renders the introductory and biographical paragraphs", () => {
    render(<AboutMe />);

    const introText = screen.getByText(
      /My name is Alec Hajinoff, and I am a freelance software engineer/i,
    );
    expect(introText).toBeInTheDocument();

    const backgroundText = screen.getByText(
      /My path into software engineering began while working at a food wholesale company/i,
    );
    expect(backgroundText).toBeInTheDocument();
  });

  test("renders all core sub-headings", () => {
    render(<AboutMe />);

    const expectedHeadings = [
      "Background",
      "Approach to Software Development",
      "Professional Characteristics",
      "Continuous Development",
      "Working With Me",
    ];

    expectedHeadings.forEach((headingText) => {
      const headingElement = screen.getByRole("heading", { name: headingText });
      expect(headingElement).toBeInTheDocument();
      expect(headingElement).toHaveClass("h5", "mt-4");
    });
  });

  test("renders structured lists (approach, characteristics, and client expectations)", () => {
    render(<AboutMe />);

    const engineeringRequirement = screen.getByText(
      /Requirements engineering/i,
    );
    const traitPatience = screen.getByText(/Patience/i); // Defined correctly here
    const communicationExpectation = screen.getByText(
      /Clear communication and straightforward discussions/i,
    );

    expect(engineeringRequirement).toBeInTheDocument();
    expect(traitPatience).toBeInTheDocument();
    expect(communicationExpectation).toBeInTheDocument();
  });

  test("renders the mocked Certifications child component successfully", () => {
    render(<AboutMe />);

    const certificationsMock = screen.getByTestId("mock-certifications");
    expect(certificationsMock).toBeInTheDocument();
    expect(certificationsMock).toHaveTextContent(
      "Mocked Certifications Component",
    );
  });
});
