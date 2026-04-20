import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Header from "../Header";
import blue from "../ContributionLineLogoColoured.png";

jest.mock("../ContributionLineLogoColoured.png", () => "mock-logo.png");

describe("Header", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });

  test("renders the logo image with correct attributes", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const logo = screen.getByRole("img", { name: /a company logo/i });

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mock-logo.png");
    expect(logo).toHaveAttribute("alt", "A company logo");
    expect(logo).toHaveAttribute("title", "A company logo");
  });

  test("logo links to the home page", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/");
  });
});
