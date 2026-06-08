import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Footer from "../Footer";

describe("Footer Component Unit Tests", () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test("renders office metadata with the correct dynamic calculation of the current calendar year", () => {
    const currentYear = new Date().getFullYear();

    renderWithRouter(<Footer />);

    const expectedCopyrightText = `© Copyright 2025 - ${currentYear}. Office address: 4 Bridge Gate, London, N21 2AH, United Kingdom.`;

    expect(
      screen.getByText((content, element) => {
        const hasText = (node) =>
          node.textContent.includes(expectedCopyrightText);
        const nodeHasText = hasText(element);

        const childrenDoNotHaveText = Array.from(element.children).every(
          (child) => !hasText(child),
        );

        return nodeHasText && childrenDoNotHaveText;
      }),
    ).toBeInTheDocument();
  });

  test("unscrambles, constructs, and links the obfuscated corporate email address correctly", () => {
    renderWithRouter(<Footer />);

    const emailLink = screen.getByRole("link", {
      name: "alec@hertfordstandard.com",
    });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:alec@hertfordstandard.com",
    );
  });

  test("renders functional navigation anchors pointing to Privacy Policy and Terms of Service documents", () => {
    renderWithRouter(<Footer />);

    const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
    const termsLink = screen.getByRole("link", { name: /terms of service/i });

    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/Privacypolicy");

    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/Termsofservice");
  });

  test("includes the decorative pipe separator element in the DOM", () => {
    renderWithRouter(<Footer />);

    const separator = screen.getByText("|");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass("footer-separator");
  });
});
