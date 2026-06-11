import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TechnologyStack from "../TechnologyStack";

if (typeof window !== "undefined") {
  if (!window.getSelection) {
    const mockSelection = () => ({
      removeAllRanges: () => {},
      addRange: () => {},
      getRangeAt: () => ({
        setStart: () => {},
        setEnd: () => {},
        cloneRange: () => ({
          collapse: () => {},
        }),
        collapse: () => {},
      }),
    });
    window.getSelection = mockSelection;
    document.getSelection = mockSelection;
  }

  if (!document.createRange) {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      cloneRange: function () {
        return this;
      },
      collapse: () => {},
      getClientRects: () => [],
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      }),
      commonAncestorContainer: {
        nodeName: "#document",
        type: "ELEMENT_NODE",
      },
    });
  }
}

describe("TechnologyStack Component Presentation Tests", () => {
  test("The Static Layer: renders the core semantic section heading", () => {
    render(<TechnologyStack />);

    const mainHeading = screen.getByRole("heading", { level: 5 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Technology stack/i);
  });

  test("Data Mapping Layer: renders all distinct technology classification group tags", () => {
    render(<TechnologyStack />);

    expect(screen.getByText(/Frontend:/i)).toBeInTheDocument();
    expect(screen.getByText(/Backend:/i)).toBeInTheDocument();
    expect(screen.getByText(/Database:/i)).toBeInTheDocument();
  });

  test("Accessibility Layer: maps and outputs correct individual tech names alongside alt text identifiers", () => {
    render(<TechnologyStack />);

    const expectedTechnologies = [
      "HTML5",
      "CSS",
      "JavaScript",
      "React",
      "Bootstrap",
      "PHP",
      "MySQL",
    ];

    expectedTechnologies.forEach((techName) => {
      const textLabel = screen.getByText(techName);
      expect(textLabel).toBeInTheDocument();

      const imageElement = screen.getByAltText(`${techName} Logo`);
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute("src");
    });
  });
});
