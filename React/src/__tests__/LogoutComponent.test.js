import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LogoutComponent from "../LogoutComponent";
import { logoutUser } from "../ApiService";

jest.mock("../ApiService", () => ({
  logoutUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LogoutComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls logoutUser and navigates to home on success", async () => {
    logoutUser.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <LogoutComponent />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("logs error and does not navigate on failure", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    logoutUser.mockRejectedValueOnce(new Error("Logout failed"));

    render(
      <MemoryRouter>
        <LogoutComponent />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Logout failed");

    consoleSpy.mockRestore();
  });
});
