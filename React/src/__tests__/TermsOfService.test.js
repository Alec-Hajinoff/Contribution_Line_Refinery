import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TermsOfService from "../TermsOfService";

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

describe("TermsOfService Component Presentation Tests", () => {
  test("The Static Layer: renders the core document title layout", () => {
    render(<TermsOfService />);

    const mainTitle = screen.getByRole("heading", { level: 1 });
    expect(mainTitle).toBeInTheDocument();
    expect(mainTitle).toHaveTextContent(/Terms of Service/i);
  });

  test("Dynamic Evaluation Layer: accurately tracks and displays the current execution date format", () => {
    render(<TermsOfService />);

    const expectedCurrentDateString = new Date().toLocaleDateString();

    const dateTextElement = screen.getByText(
      new RegExp(`Effective Date:\\s*${expectedCurrentDateString}`, "i"),
    );
    expect(dateTextElement).toBeInTheDocument();
  });

  test("Content Layout Layer: maps and displays essential legal sections sequentially", () => {
    render(<TermsOfService />);

    const mandatorySections = [
      "1. Introduction",
      "2. About Hertford Standard",
      "6. Intellectual Property",
      "9. Limitation of Liability",
      "12. Governing Law",
      "14. Contact",
    ];

    mandatorySections.forEach((sectionTitle) => {
      const headingElement = screen.getByRole("heading", {
        name: sectionTitle,
        level: 2,
      });
      expect(headingElement).toBeInTheDocument();
    });
  });

  test("Detail Resolution Layer: validates that bulleted provision lists are mapped cleanly into the layout tree", () => {
    render(<TermsOfService />);

    const explicitProvisions = [
      "Present software development services and capabilities",
      "Attempt to gain unauthorised access to systems, accounts, or data",
      "Maintaining the confidentiality of your login credentials",
      "Any indirect, incidental, or consequential losses",
    ];

    explicitProvisions.forEach((provisionText) => {
      const listItemText = screen.getByText(new RegExp(provisionText, "i"));
      expect(listItemText).toBeInTheDocument();
    });
  });
});
