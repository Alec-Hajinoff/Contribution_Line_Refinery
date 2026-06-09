import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Portfolio from "../Portfolio";

jest.mock("../Images/trainingapi_logo.png", () => "mocked-logo-file-path.png");

describe("Portfolio Component Layout and Accessibility Link Tests", () => {
  test("renders primary layout container frames and hero section headings successfully", () => {
    render(<Portfolio />);

    const mainHeroTitle = screen.getByRole("heading", {
      level: 2,
      name: /A practical overview of recent work/i,
    });
    expect(mainHeroTitle).toBeInTheDocument();
    expect(mainHeroTitle).toHaveClass("hero-title");
  });

  test("paints imported system showcase logo with descriptive accessibility alt text tags", () => {
    render(<Portfolio />);

    const systemLogoImg = screen.getByRole("img", {
      name: /TrainingApi Logo/i,
    });
    expect(systemLogoImg).toBeInTheDocument();
    expect(systemLogoImg).toHaveAttribute("src", "mocked-logo-file-path.png");
    expect(systemLogoImg).toHaveClass("portfolio-logo");
  });

  test("renders descriptive textual layout subsections using appropriate lower header hierarchy rules", () => {
    render(<Portfolio />);

    expect(
      screen.getByRole("heading", { level: 2, name: /1\. Business Purpose/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /2\. My Role/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /3\. Technical Highlights/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /4\. Key Features/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /5\. Outcome/i }),
    ).toBeInTheDocument();
  });

  test("contains secure outward hyperlinks redirecting users cleanly to live demo endpoints", () => {
    render(<Portfolio />);

    const demoLinks = screen.getAllByRole("link", { name: /TrainingApi/i });
    expect(demoLinks.length).toBeGreaterThan(0);

    demoLinks.forEach((linkItem) => {
      expect(linkItem).toHaveAttribute("href", "https://trainingapi.com/");
      expect(linkItem).toHaveAttribute("target", "_blank");
      expect(linkItem).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  test("contains secure outward hyperlinks redirecting users cleanly to GitHub source repositories", () => {
    render(<Portfolio />);

    const codeRepositoryLink = screen.getByRole("link", {
      name: /Browse code on GitHub/i,
    });
    expect(codeRepositoryLink).toBeInTheDocument();
    expect(codeRepositoryLink).toHaveAttribute(
      "href",
      "https://github.com/Alec-Hajinoff/TrainingAPI",
    );
    expect(codeRepositoryLink).toHaveAttribute("target", "_blank");
    expect(codeRepositoryLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders summary key highlight items across nested list arrays cleanly", () => {
    render(<Portfolio />);

    expect(
      screen.getByText(
        (content, element) =>
          element.tagName === "STRONG" &&
          /Structured\s+catalogue/i.test(content),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element.tagName === "STRONG" &&
          /Skill.*gap\s+requests/i.test(content),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element.tagName === "STRONG" && /LMS\s+integration/i.test(content),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element.tagName === "STRONG" &&
          /Streamlined\s+delivery/i.test(content),
      ),
    ).toBeInTheDocument();
  });
});
