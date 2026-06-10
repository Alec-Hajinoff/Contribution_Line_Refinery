import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProtectedRoute from "../ProtectedRoute";
import { checkSession } from "../ApiService";

jest.mock("../ApiService", () => ({
  checkSession: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: (props) => {
    mockNavigate(props);
    return <div data-testid="mock-navigate" />;
  },
}));

describe("ProtectedRoute Component Authentication Lifecycle Tests", () => {
  const FakeChildComponent = () => (
    <div data-testid="child-content">Secure Admin Content</div>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Initial State: renders a completely blank layout while the session validation request is pending", () => {
    checkSession.mockReturnValueOnce(new Promise(() => {}));

    const { container } = render(
      <ProtectedRoute>
        <FakeChildComponent />
      </ProtectedRoute>,
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-navigate")).not.toBeInTheDocument();
  });

  test("Branch A (Happy Path): grants passage and renders child nodes when verification is authenticated", async () => {
    checkSession.mockResolvedValueOnce({ authenticated: true });

    render(
      <ProtectedRoute>
        <FakeChildComponent />
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    expect(screen.getByText("Secure Admin Content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(checkSession).toHaveBeenCalledTimes(1);
  });

  test("Branch B (Broken Path): blocks layout execution and triggers a hard redirect if verification is unauthenticated", async () => {
    checkSession.mockResolvedValueOnce({ authenticated: false });

    render(
      <ProtectedRoute>
        <FakeChildComponent />
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mock-navigate")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/",
      replace: true,
    });
  });

  test("Branch B (Catastrophic Path): falls back to blocking and redirecting if the session endpoint rejects", async () => {
    checkSession.mockRejectedValueOnce(
      new Error("Session verification timeout"),
    );

    render(
      <ProtectedRoute>
        <FakeChildComponent />
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mock-navigate")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/",
      replace: true,
    });
  });
});
