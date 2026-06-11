import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import UserLogin from "../UserLogin";
import { loginUser, passwordResetLink } from "../ApiService";

if (typeof window !== "undefined") {
  if (!window.getSelection) {
    const mockSelection = () => ({
      removeAllRanges: () => {},
      addRange: () => {},
      getRangeAt: () => ({
        setStart: () => {},
        setEnd: () => {},
        cloneRange: () => ({ collapse: () => {} }),
        collapse: () => {},
      }),
    });
    window.getSelection = mockSelection;
    document.getSelection = mockSelection;
  }

  if (!document.createRange) {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      cloneRange: function () {
        return this;
      },
      collapse: () => {},
      getClientRects: () => [],
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      }),
      commonAncestorContainer: { nodeName: "#document", type: "ELEMENT_NODE" },
    });
  }
}

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../ApiService", () => ({
  loginUser: jest.fn(),
  passwordResetLink: jest.fn(),
}));

describe("UserLogin Component Interaction and Lifecycle Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("The Static Layer: renders input variables and initial submit layouts accurately", () => {
    render(<UserLogin />);

    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Forgot your password\?/i }),
    ).toBeInTheDocument();
  });

  test("Validation Layer: catches invalid formatting errors prior to initiating network activity", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    await user.type(emailInput, "incorrect-email-string");
    await user.type(passwordInput, "validSecret123");
    await user.click(loginButton);

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);
    expect(
      screen.queryByText(/Please enter a valid email address/i),
    ).not.toHaveTextContent();

    await user.clear(emailInput);
    await user.type(emailInput, "testuser@domain.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "short");
    await user.click(loginButton);

    expect(
      screen.getByText(
        /Please ensure your password is at least 8 characters long/i,
      ),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("Branch A (Happy Path Client): routes normal client accounts onwards to the client workspace dashboard", async () => {
    loginUser.mockResolvedValueOnce({ status: "success", is_admin: false });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "client@hertford.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Password/i),
      "securedPassword123",
    );
    await user.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "client@hertford.com",
        password: "securedPassword123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/UserDashboard");
    });
  });

  test("Branch B (Happy Path Admin): redirects higher-privileged administrators onwards to the admin panel dashboard", async () => {
    loginUser.mockResolvedValueOnce({ status: "success", is_admin: 1 });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "admin@hertford.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Password/i),
      "adminPasswordSettings99",
    );
    await user.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/AdminDashboard");
    });
  });

  test("Branch C (Unverified Path): displays an account confirmation alert banner and clears out credentials", async () => {
    loginUser.mockResolvedValueOnce({
      status: "unverified",
      message:
        "Please complete verification via your registration confirmation link.",
    });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    const passwordField = screen.getByPlaceholderText(/Password/i);
    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "unverified@domain.com",
    );
    await user.type(passwordField, "somePasswordString");
    await user.click(screen.getByRole("button", { name: /Login/i }));

    const alertMessage = await screen.findByText(
      /Please complete verification via your registration/i,
    );
    expect(alertMessage).toBeInTheDocument();

    expect(passwordField).toHaveValue("");

    jest.advanceTimersByTime(5000);
    expect(alertMessage).not.toHaveTextContent();
  });

  test("Branch D (Broken Credentials/Network Failures): renders contextual errors cleanly on failure exceptions", async () => {
    loginUser.mockRejectedValueOnce(
      new Error("Database lookup timeout error exception"),
    );
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "erroruser@domain.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Password/i),
      "anyArbitraryPassword",
    );
    await user.click(screen.getByRole("button", { name: /Login/i }));

    const errorContainer = await screen.findByText(
      /Database lookup timeout error exception/i,
    );
    expect(errorContainer).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toHaveValue("");
  });

  test("Recovery Link Layer: issues a recovery link generation sequence when tracking user choices", async () => {
    passwordResetLink.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserLogin />);

    const resetTriggerBtn = screen.getByRole("button", {
      name: /Forgot your password\?/i,
    });

    await user.click(resetTriggerBtn);
    expect(
      screen.getByText(/Please enter your email address so we can help you/i),
    ).toBeInTheDocument();
    expect(passwordResetLink).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);
    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "recoverytarget@domain.com",
    );
    await user.click(resetTriggerBtn);

    expect(passwordResetLink).toHaveBeenCalledWith("recoverytarget@domain.com");

    const operationalNotice = await screen.findByText(
      /If an account exists for this email address, a password reset link has been sent/i,
    );
    expect(operationalNotice).toBeInTheDocument();

    jest.advanceTimersByTime(5000);
    expect(operationalNotice).not.toHaveTextContent();
  });
});
