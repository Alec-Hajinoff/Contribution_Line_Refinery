import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import UserLogin from "../UserLogin";
import { loginUser } from "../ApiService";

jest.mock("../ApiService", () => ({
  loginUser: jest.fn(),
  passwordResetLink: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = (email = "test@example.com", password = "password123") => {
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: password },
    });
  };

  it("renders the login form with all fields", () => {
    render(<UserLogin />);
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates form data when input values change", () => {
    render(<UserLogin />);
    const emailInput = screen.getByPlaceholderText("Email address");
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  });

  it("submits the form and navigates to UserDashboard on success", async () => {
    loginUser.mockResolvedValueOnce({ status: "success" });
    render(<UserLogin />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/UserDashboard");
    });
  });

  it("displays an error message when login credentials are invalid", async () => {
    loginUser.mockResolvedValueOnce({
      status: "failure",
      message: "Invalid credentials",
    });
    render(<UserLogin />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("displays validation error for invalid email format", async () => {
    render(<UserLogin />);
    fillForm("invalid-email", "password123");
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("displays an error message when the API call fails", async () => {
    loginUser.mockRejectedValueOnce(new Error("An error occurred."));
    render(<UserLogin />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("An error occurred.")).toBeInTheDocument();
  });
});
