import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PasswordReset from "../PasswordReset";
import { passwordResetToken, updatePassword } from "../ApiService";

jest.mock("../ApiService", () => ({
  passwordResetToken: jest.fn(),
  updatePassword: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("PasswordReset Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithToken = (token = "test-token") => {
    return render(
      <MemoryRouter initialEntries={[`/PasswordReset?token=${token}`]}>
        <Routes>
          <Route path="/PasswordReset" element={<PasswordReset />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("shows loading state and verifies token on mount", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    renderWithToken();

    expect(screen.getByText(/Verifying your link/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(passwordResetToken).toHaveBeenCalledWith("test-token");
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });
  });

  test("shows error message if token is invalid", async () => {
    passwordResetToken.mockResolvedValueOnce({
      valid: false,
      message: "Invalid link",
    });
    renderWithToken();

    await waitFor(() => {
      expect(screen.getByText(/Invalid link/i)).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Return to home page/i }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows generic error message if token is missing in URL", async () => {
    render(
      <MemoryRouter initialEntries={["/PasswordReset"]}>
        <PasswordReset />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/This link may have expired/i),
      ).toBeInTheDocument();
    });
  });

  test("displays error for password shorter than 8 characters", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    renderWithToken();

    await waitFor(() => screen.getByPlaceholderText("New password"));

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(
      screen.getByText(/Password must be at least 8 characters long/i),
    ).toBeInTheDocument();
    expect(updatePassword).not.toHaveBeenCalled();
  });

  test("displays error when passwords do not match", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    renderWithToken();

    await waitFor(() => screen.getByPlaceholderText("New password"));

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "mismatch123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("successfully updates password and shows success view", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockResolvedValueOnce({ success: true });

    renderWithToken();
    await waitFor(() => screen.getByPlaceholderText("New password"));

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(
      screen.getByRole("button", { name: /Update password/i }),
    ).toBeDisabled();

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith(
        "test-token",
        "newpassword123",
      );
      expect(
        screen.getByText(/Your password has been updated/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("New password")).toBeDisabled();
    expect(screen.getByPlaceholderText("Confirm password")).toBeDisabled();

    const returnHomeBtn = screen.getByRole("button", {
      name: /Return to home page/i,
    });
    fireEvent.click(returnHomeBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles API error message from backend during update", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockResolvedValueOnce({
      success: false,
      message: "Backend error",
    });

    renderWithToken();
    await waitFor(() => screen.getByPlaceholderText("New password"));

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Backend error/i)).toBeInTheDocument();
    });
  });

  test("handles unexpected network error during update", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockRejectedValueOnce(new Error("Network Fail"));

    renderWithToken();
    await waitFor(() => screen.getByPlaceholderText("New password"));

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "newpassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred. Please try again./i),
      ).toBeInTheDocument();
    });
  });
});