import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import PasswordReset from "../PasswordReset";
import {
  passwordResetToken as mockVerifyToken,
  updatePassword as mockUpdatePassword,
} from "../ApiService";

jest.mock("../ApiService", () => ({
  passwordResetToken: jest.fn(),
  updatePassword: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithToken = (tokenValue) => {
  const queryPath = tokenValue
    ? `/password-reset?token=${tokenValue}`
    : "/password-reset";
  return render(
    <MemoryRouter initialEntries={[queryPath]}>
      <PasswordReset />
    </MemoryRouter>,
  );
};

describe("PasswordReset Component State and Verification Workflow Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("displays an initial loading spinner layout panel while evaluating token validity", () => {
    mockVerifyToken.mockReturnValueOnce(new Promise(() => {}));

    renderWithToken("secure-test-token-123");

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText(/We are verifying your password reset link/i),
    ).toBeInTheDocument();
  });

  test("renders an error notice screen if the token URL parameter is missing entirely", async () => {
    renderWithToken(null);

    expect(mockVerifyToken).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText(/This password reset link is no longer valid/i),
      ).toBeInTheDocument();
    });

    const homeBtn = screen.getByRole("button", {
      name: /Return to home page/i,
    });
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders an error notice screen if the backend explicitly rejects token validity parameters", async () => {
    mockVerifyToken.mockResolvedValueOnce({
      valid: false,
      message: "Custom Token Expiration Error.",
    });

    renderWithToken("invalid-expired-token");

    await waitFor(() => {
      expect(
        screen.getByText("Custom Token Expiration Error."),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByPlaceholderText("New password"),
    ).not.toBeInTheDocument();
  });

  test("mounts the password adjustment input form layout cleanly upon successful token verification", async () => {
    mockVerifyToken.mockResolvedValueOnce({ valid: true });

    renderWithToken("valid-active-token");

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update password" }),
    ).toBeInTheDocument();
  });

  test("rejects input submissions shorter than 8 characters and automatically dismisses error banner over time", async () => {
    mockVerifyToken.mockResolvedValueOnce({ valid: true });
    renderWithToken("valid-active-token");

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "short17" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "short17" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      screen.getByText(
        /Please enter a password that is at least 8 characters long/i,
      ),
    ).toBeInTheDocument();
    expect(mockUpdatePassword).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(
      screen.queryByText(
        /Please enter a password that is at least 8 characters long/i,
      ),
    ).not.toBeInTheDocument();
  });

  test("rejects input submissions where password field inputs do not match one another", async () => {
    mockVerifyToken.mockResolvedValueOnce({ valid: true });
    renderWithToken("valid-active-token");

    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "SecurePass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "DifferentPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      screen.getByText(/The passwords you entered do not match/i),
    ).toBeInTheDocument();
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  test("submits form data properly and displays a home navigation pipeline upon successful modification", async () => {
    mockVerifyToken.mockResolvedValueOnce({ valid: true });
    mockUpdatePassword.mockResolvedValueOnce({ success: true });

    renderWithToken("valid-active-token");
    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "ValidPassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "ValidPassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(mockUpdatePassword).toHaveBeenCalledWith(
      "valid-active-token",
      "ValidPassword123",
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Your password has been updated successfully/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Update password" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Return to home page/i }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles server submission update errors gracefully and shows error panels", async () => {
    mockVerifyToken.mockResolvedValueOnce({ valid: true });
    mockUpdatePassword.mockResolvedValueOnce({
      success: false,
      message: "Password has been previously used.",
    });

    renderWithToken("valid-active-token");
    await waitFor(() => {
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "ValidPassword123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "ValidPassword123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password has been previously used."),
      ).toBeInTheDocument();
    });
  });
});
