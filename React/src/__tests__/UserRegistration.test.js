import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import UserRegistration from "../UserRegistration";
import { registerUser } from "../ApiService";

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
  registerUser: jest.fn(),
}));

describe("UserRegistration Component Interaction and Lifecycle Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("The Static Layer: renders registration inputs and active action buttons correctly", () => {
    render(<UserRegistration />);

    expect(screen.getByPlaceholderText(/Your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Choose a strong password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i }),
    ).toBeInTheDocument();
  });

  test("Validation Layer: catches invalid character inputs in name values", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    await user.type(nameInput, "Jane Doe 123");
    await user.click(registerButton);

    const errorContainer = screen.getByText(
      /Please enter a name using letters and spaces only\./i,
    );
    expect(errorContainer).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);
    expect(errorContainer).not.toHaveTextContent();
  });

  test("Validation Layer: intercepts invalid email formatting structures", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "missing-at-sign.com");
    await user.click(registerButton);

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test("Validation Layer: enforces password baseline length restrictions", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(
      /Choose a strong password/i,
    );
    const registerButton = screen.getByRole("button", { name: /Register/i });

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.type(passwordInput, "short");
    await user.click(registerButton);

    expect(
      screen.getByText(
        /Please choose a password with at least 8 characters\./i,
      ),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test("Branch A (Happy Path Success): updates status UI, wipes input forms, and triggers delayed clear routines", async () => {
    registerUser.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(
      /Choose a strong password/i,
    );
    const registerButton = screen.getByRole("button", { name: /Register/i });

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.type(passwordInput, "secureSecretPassword123");

    await user.click(registerButton);

    expect(screen.getByRole("button")).toHaveTextContent(/Registering/i);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "secureSecretPassword123",
      });
    });

    const successBanner = await screen.findByText(
      /Please check your email for a link to confirm your address/i,
    );
    expect(successBanner).toBeInTheDocument();

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");

    jest.advanceTimersByTime(5000);
    expect(successBanner).not.toHaveTextContent();
  });

  test("Branch B (API Operational Rejection): yields explicit rejection string feedback and wipes credentials", async () => {
    registerUser.mockResolvedValueOnce({
      success: false,
      message:
        "This specific email address is already connected to an active account.",
    });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    const nameInput = screen.getByPlaceholderText(/Your full name/i);
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    const passwordInput = screen.getByPlaceholderText(
      /Choose a strong password/i,
    );

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "duplicate@example.com");
    await user.type(passwordInput, "securePass9988");
    await user.click(screen.getByRole("button", { name: /Register/i }));

    const backendFeedback = await screen.findByText(
      /This specific email address is already connected/i,
    );
    expect(backendFeedback).toBeInTheDocument();

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  test("Branch C (Asynchronous Error Catching): logs unexpected network thrown exceptions inside error slots", async () => {
    registerUser.mockRejectedValueOnce(
      new Error("Cloud network connection drops or standard server failures."),
    );
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UserRegistration />);

    await user.type(screen.getByPlaceholderText(/Your full name/i), "Jane Doe");
    await user.type(
      screen.getByPlaceholderText(/Email address/i),
      "jane@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Choose a strong password/i),
      "passwordStringVal",
    );
    await user.click(screen.getByRole("button", { name: /Register/i }));

    const standardExceptionBlock = await screen.findByText(
      /Cloud network connection drops or standard server failures\./i,
    );
    expect(standardExceptionBlock).toBeInTheDocument();
  });
});
