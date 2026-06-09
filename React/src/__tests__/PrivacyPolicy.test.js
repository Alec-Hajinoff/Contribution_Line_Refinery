import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrivacyPolicy from "../PrivacyPolicy";

describe("PrivacyPolicy Component Layout and Content Tests", () => {
  test("renders primary structural layout frameworks, page headings, and dynamic effective date", () => {
    render(<PrivacyPolicy />);

    const mainHeading = screen.getByRole("heading", {
      name: /Privacy Policy/i,
      level: 1,
    });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveClass("privacy-policy-title", "h5");

    expect(
      screen.getByText((content, element) => {
        return element.tagName === "P" && /Effective Date:/i.test(content);
      }),
    ).toBeInTheDocument();
  });

  test("renders all mandatory lower section headers using correct accessibility hierarchy rules", () => {
    render(<PrivacyPolicy />);

    const expectedSections = [
      "1. Introduction",
      "2. Data Controller",
      "3. Personal Data We Collect",
      "3.1 Information You Provide",
      "3.2 Technical Data",
      "3.3 Client Project Data",
      "4. How We Use Your Data",
      "5. Lawful Basis for Processing",
      "6. Data Sharing",
      "7. Data Storage and Security",
      "8. Data Retention",
      "9. Your Rights",
      "10. Cookies",
      "11. International Transfers",
      "12. Changes to This Policy",
    ];

    expectedSections.forEach((sectionText) => {
      const heading = screen.getByRole("heading", {
        name: new RegExp(sectionText, "i"),
        level: 2,
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("h5", "mt-4");
    });
  });

  test("renders detailed policy clauses and itemised highlight lists cleanly", () => {
    render(<PrivacyPolicy />);

    const expectedListHighlights = [
      /Name and contact details/i,
      /Account registration details/i,
      /Project enquiry and specification/i,
      /Communications and correspondence/i,
      /IP address.*network identifiers/i,
      /Browser type.*version/i,
      /Device and operating system/i,
      /Usage data/i,
      /Contractual necessity/i,
      /Legitimate interests/i,
      /Access your personal data/i,
      /Request correction/i,
      /Request deletion/i,
    ];

    expectedListHighlights.forEach((pattern) => {
      expect(
        screen.getByText((content, element) => {
          return element.tagName === "STRONG" && pattern.test(content);
        }),
      ).toBeInTheDocument();
    });
  });
});
