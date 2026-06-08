import React from "react";
import { render, screen, waitFor } from "@testing-library/react"; // Added waitFor
import "@testing-library/jest-dom";
import App from "../App";
import { checkSession } from "../ApiService";

jest.mock("../ApiService", () => ({
  checkSession: jest.fn(),
}));

jest.mock("../Header", () => {
  return function DummyHeader({ isAuthenticated, isLoading }) {
    return (
      <div data-testid="mock-header">
        <span>Auth: {isAuthenticated ? "true" : "false"}</span>
        <span>Loading: {isLoading ? "true" : "false"}</span>
      </div>
    );
  };
});

jest.mock("../NavigationBar", () => {
  return function DummyNavigationBar({ isAuthenticated, isLoading, userRole }) {
    return (
      <div data-testid="mock-navigation-bar">
        <span>NavAuth: {isAuthenticated ? "true" : "false"}</span>
        <span>NavRole: {userRole || "guest"}</span>
      </div>
    );
  };
});

jest.mock("../AppRoutes", () => {
  return function DummyAppRoutes() {
    return <div data-testid="mock-app-routes">Mocked App Routes</div>;
  };
});

jest.mock("../Footer", () => {
  return function DummyFooter() {
    return <div data-testid="mock-footer">Mocked Footer</div>;
  };
});

jest.mock("../ScrollToTop", () => {
  return function DummyScrollToTop() {
    return null;
  };
});

describe("App Component Layout & Session Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("shows initial loading states while verifySession checks credentials", async () => {
    checkSession.mockReturnValueOnce(new Promise(() => {}));

    render(<App />);

    const headerElement = screen.getByTestId("mock-header");
    expect(headerElement).toHaveTextContent("Loading: true");
    expect(headerElement).toHaveTextContent("Auth: false");
  });

  test("configures structural layouts properly for an authenticated Admin profile", async () => {
    checkSession.mockResolvedValueOnce({
      authenticated: true,
      is_admin: true,
    });

    render(<App />);

    await waitFor(() => {
      const headerElement = screen.getByTestId("mock-header");
      expect(headerElement).toHaveTextContent("Loading: false");
      expect(headerElement).toHaveTextContent("Auth: true");
    });

    const navigationBar = screen.getByTestId("mock-navigation-bar");
    expect(navigationBar).toHaveTextContent("NavAuth: true");
    expect(navigationBar).toHaveTextContent("NavRole: admin");
  });

  test("configures structural layouts properly for a standard Authenticated User profile", async () => {
    checkSession.mockResolvedValueOnce({
      authenticated: true,
      is_admin: false,
    });

    render(<App />);

    const navigationBar = await screen.findByTestId("mock-navigation-bar");

    expect(navigationBar).toHaveTextContent("NavAuth: true");
    expect(navigationBar).toHaveTextContent("NavRole: user");
  });

  test("defaults to safe Guest fallback layouts if checkSession returns false", async () => {
    checkSession.mockResolvedValueOnce({
      authenticated: false,
    });

    render(<App />);

    const navigationBar = await screen.findByTestId("mock-navigation-bar");
    const headerElement = screen.getByTestId("mock-header");

    expect(headerElement).toHaveTextContent("Auth: false");
    expect(navigationBar).toHaveTextContent("NavAuth: false");

    expect(navigationBar).toHaveTextContent("NavRole: user");
  });

  test("defaults to safe Guest fallback layouts if checkSession service crashes entirely", async () => {
    checkSession.mockRejectedValueOnce(new Error("Database disconnected"));

    render(<App />);

    const navigationBar = await screen.findByTestId("mock-navigation-bar");

    expect(navigationBar).toHaveTextContent("NavAuth: false");
    expect(navigationBar).toHaveTextContent("NavRole: guest"); // This passes because the catch block sets role to null
  });
});
