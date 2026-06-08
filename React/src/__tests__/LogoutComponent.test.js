import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import LogoutComponent from "../LogoutComponent";
import { logoutUser as mockLogoutUser } from "../ApiService";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../ApiService", () => ({
  logoutUser: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("LogoutComponent Unit and Integration Tests", () => {
  const mockOnLogoutComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the logout interface action button successfully", () => {
    renderWithRouter(
      <LogoutComponent onLogoutComplete={mockOnLogoutComplete} />,
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass("btn-text");
  });

  test("executes logout routines, redirects home, and triggers parent pipeline callbacks upon success", async () => {
    mockLogoutUser.mockResolvedValueOnce({ success: true });

    renderWithRouter(
      <LogoutComponent onLogoutComplete={mockOnLogoutComplete} />,
    );
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    expect(mockOnLogoutComplete).toHaveBeenCalledTimes(1);
  });

  test("does not crash or fail if the onLogoutComplete wrapper property is omitted or unprovided", async () => {
    mockLogoutUser.mockResolvedValueOnce({ success: true });

    renderWithRouter(<LogoutComponent />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    await expect(
      (async () => {
        fireEvent.click(logoutButton);
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/");
        });
      })(),
    ).resolves.not.toThrow();
  });

  test("catches and handles server exceptions cleanly without disrupting the application thread runtime", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockLogoutUser.mockRejectedValueOnce(new Error("Network gateway timeout."));

    renderWithRouter(
      <LogoutComponent onLogoutComplete={mockOnLogoutComplete} />,
    );
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogoutUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Network gateway timeout.");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockOnLogoutComplete).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
