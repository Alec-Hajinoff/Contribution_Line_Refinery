import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRegistration from "../UserRegistration";
import { registerUser } from "../ApiService";

jest.mock("../ApiService", () => ({
  registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserRegistration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = (
    name = "John Doe",
    email = "john@example.com",
    password = "password123",
  ) => {
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose a strong password"), {
      target: { value: password },
    });
  };

  it("renders the registration form with all required fields", () => {
    render(<UserRegistration />);

    expect(screen.getByPlaceholderText("Your full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Choose a strong password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("updates form data when input values change", () => {
    render(<UserRegistration />);
    const nameInput = screen.getByPlaceholderText("Your full name");
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    expect(nameInput.value).toBe("Jane Smith");
  });

  it("displays an error if the name contains invalid characters", () => {
    render(<UserRegistration />);
    fillForm("John123");
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(
      screen.getByText("Name can only contain letters and spaces"),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("displays an error for an invalid email address", () => {
    render(<UserRegistration />);
    fillForm("John Doe", "invalid-email");
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(
      screen.getByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("displays an error for a password shorter than 8 characters", () => {
    render(<UserRegistration />);
    fillForm("John Doe", "john@example.com", "short");
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(
      screen.getByText("Password must be at least 8 characters long"),
    ).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("submits the form successfully and shows a success message", async () => {
    registerUser.mockResolvedValueOnce({ success: true });
    render(<UserRegistration />);

    fillForm("John Doe", "john@example.com", "password123");
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });

    expect(
      await screen.findByText(/Check your email to sign in/i),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Your full name").value).toBe("");
    expect(screen.getByPlaceholderText("Email address").value).toBe("");
  });

  it("displays an error message when the API registration fails", async () => {
    registerUser.mockResolvedValueOnce({
      success: false,
      message: "Email already exists",
    });
    render(<UserRegistration />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });

  it("displays an error message when the API call throws an exception", async () => {
    registerUser.mockRejectedValueOnce(new Error("Server error"));
    render(<UserRegistration />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
