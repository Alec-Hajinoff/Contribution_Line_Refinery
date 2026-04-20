import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  test("renders correctly with current year range", () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`2025 - ${currentYear}`)),
    ).toBeInTheDocument();
  });

  test("contains correct company address information", () => {
    render(<Footer />);

    expect(
      screen.getByText(/4 Bridge Gate, London, N21 2AH, United Kingdom/i),
    ).toBeInTheDocument();
  });

  test("contains valid mailto link", () => {
    render(<Footer />);

    const link = screen.getByRole("link", {
      name: /team@contributionline\.com/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:team@contributionline.com");
  });
});
