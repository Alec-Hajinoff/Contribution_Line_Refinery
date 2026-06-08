import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Header from "../Header";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="mock-logout-component">Logout Trigger Panel</div>
));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Header Component Unit and Integration Tests", () => {
  const mockOnLogoutComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders company logo with appropriate accessible alternative text descriptions", () => {
    renderWithRouter(
      <Header
        isAuthenticated={false}
        isLoading={false}
        onLogoutComplete={mockOnLogoutComplete}
      />,
    );

    const logoImg = screen.getByRole("img", { name: "A company logo" });
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute("title", "A company logo");

    const linkAnchor = screen.getByRole("link");
    expect(linkAnchor).toBeInTheDocument();
    expect(linkAnchor).toHaveAttribute("href", "/");
  });

  test("hides LogoutComponent completely when the system loading indicator flag is true", () => {
    renderWithRouter(
      <Header
        isAuthenticated={true}
        isLoading={true}
        onLogoutComplete={mockOnLogoutComplete}
      />,
    );

    expect(
      screen.queryByTestId("mock-logout-component"),
    ).not.toBeInTheDocument();
  });

  test("hides LogoutComponent completely when the user profile is unauthenticated", () => {
    renderWithRouter(
      <Header
        isAuthenticated={false}
        isLoading={false}
        onLogoutComplete={mockOnLogoutComplete}
      />,
    );

    expect(
      screen.queryByTestId("mock-logout-component"),
    ).not.toBeInTheDocument();
  });

  test("renders LogoutComponent explicitly when loading concludes and user authentication is true", () => {
    renderWithRouter(
      <Header
        isAuthenticated={true}
        isLoading={false}
        onLogoutComplete={mockOnLogoutComplete}
      />,
    );

    const logoutSection = screen.getByTestId("mock-logout-component");
    expect(logoutSection).toBeInTheDocument();
    expect(logoutSection).toHaveTextContent("Logout Trigger Panel");
  });
});
