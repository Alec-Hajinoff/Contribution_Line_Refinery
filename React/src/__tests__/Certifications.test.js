import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Certifications from "../Certifications";

jest.mock("../Images/certification_icon.svg", () => ({
  __esModule: true,

  ReactComponent: function DummyCertificationIcon(props) {
    return <span data-testid="mock-certification-icon" {...props} />;
  },
}));

describe("Certifications Component Unit Tests", () => {
  test("renders the core section heading element", () => {
    render(<Certifications />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Certifications");
    expect(heading).toHaveClass("h5", "mt-4");
  });

  test("renders all 6 certification links with appropriate secure anchor properties", () => {
    const expectedCertifications = [
      {
        name: "Full Stack Engineering",
        path: "/Certifications/Completion_Certificate_Full_Stack_Engineering.pdf",
      },
      { name: "PHP", path: "/Certifications/Completion_Certificate_PHP.pdf" },
      {
        name: "Python",
        path: "/Certifications/Completion_Certificate_Python_3.pdf",
      },
      {
        name: "React",
        path: "/Certifications/Completion_Certificate_Learn_React.pdf",
      },
      {
        name: "jQuery",
        path: "/Certifications/Completion_Certificate_jQuery.pdf",
      },
      {
        name: "Bootstrap",
        path: "/Certifications/Completion_Certificate_Learn_Bootstrap.pdf",
      },
    ];

    render(<Certifications />);

    expectedCertifications.forEach((cert) => {
      const linkElement = screen.getByRole("link", { name: cert.name });

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", cert.path);
      expect(linkElement).toHaveAttribute("target", "_blank");
      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkElement).toHaveClass("certification-link");
    });
  });

  test("skips the separator icon for the first item and renders exactly 5 icons for the remaining items", () => {
    render(<Certifications />);

    const structuralIcons = screen.getAllByTestId("mock-certification-icon");
    expect(structuralIcons).toHaveLength(5);

    structuralIcons.forEach((icon) => {
      expect(icon).toHaveClass("certification-icon");
    });
  });
});
