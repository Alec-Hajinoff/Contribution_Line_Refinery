import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import VerifyEmail from "../VerifyEmail";
import { verifyEmail } from "../ApiService";

jest.mock("../ApiService", () => ({
  verifyEmail: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

describe("VerifyEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loading state initially", () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "?token=test-token" });

    render(<VerifyEmail />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.getByText("Verifying your email address..."),
    ).toBeInTheDocument();
  });

  it("displays an error when no token is provided", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "" });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(
        screen.getByText("No verification token provided."),
      ).toBeInTheDocument();
    });
  });

  it("navigates to RegisteredPage when verification is successful", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "?token=valid-token" });

    verifyEmail.mockResolvedValueOnce({ success: true });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith("valid-token");
      expect(mockNavigate).toHaveBeenCalledWith("/RegisteredPage");
    });
  });

  it("displays an error message when verification fails", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "?token=invalid-token" });

    verifyEmail.mockResolvedValueOnce({
      success: false,
      message: "Invalid or expired token",
    });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(screen.getByText("Invalid or expired token")).toBeInTheDocument();
    });
  });

  it("displays an error message when API call throws an exception", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "?token=test-token" });

    verifyEmail.mockRejectedValueOnce(new Error("Network error"));

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("navigates to home page when Register a new account button is clicked", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ search: "" });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(
        screen.getByText("No verification token provided."),
      ).toBeInTheDocument();
    });

    const registerButton = screen.getByRole("button", {
      name: /register a new account/i,
    });
    fireEvent.click(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
