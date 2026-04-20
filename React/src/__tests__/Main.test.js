import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../Main";

describe("Main", () => {
  test("renders without crashing", () => {
    const { container } = render(<Main />);
    expect(container).toBeTruthy();
  });

  test("renders the intro headline", () => {
    render(<Main />);

    expect(
      screen.getByText(/Capture your real work contributions as they happen/i),
    ).toBeInTheDocument();
  });

  test("renders all six value points with correct titles and descriptions", () => {
    render(<Main />);

    const titles = [
      "Private Record",
      "Capture As It Happens",
      "Flexible Views",
      "Evidence-Based",
      "Portable & Independent",
      "Always Prepared",
    ];

    const descriptions = [
      /Capture contributions in a secure, private system/i,
      /Log meaningful contributions at the moment/i,
      /Assemble custom views for different purposes/i,
      /Ground conversations in factual, well-organized evidence/i,
      /Records are portable and persist independently/i,
      /Maintain an up-to-date record/i,
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    descriptions.forEach((desc) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  test("renders all six icons", () => {
    render(<Main />);

    const icons = ["📋", "⏱️", "🎯", "📊", "🚀", "✅"];

    icons.forEach((icon) => {
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });
});
