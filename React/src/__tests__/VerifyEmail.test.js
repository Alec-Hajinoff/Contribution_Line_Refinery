import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VerifyEmail from "../VerifyEmail";
import { verifyEmail } from "../ApiService";

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
let mockSearchString = "";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    get search() {
      return mockSearchString;
    },
  }),
}));

jest.mock("../ApiService", () => ({
  verifyEmail: jest.fn(),
}));

describe("VerifyEmail Component Lifecycle and API Interaction Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchString = "";
  });

  test("The Guard Layer: intercepts requests missing a token parameter and terminates the loop", async () => {
    mockSearchString = "";

    render(<VerifyEmail />);

    expect(
      screen.getByText(/No verification token provided\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go to home page/i }),
    ).toBeInTheDocument();
    expect(verifyEmail).not.toHaveBeenCalled();
  });

  test("Branch A (Happy Path Success): issues token payloads and transitions to the confirmation page", async () => {
    mockSearchString = "?token=valid-security-token-999";
    verifyEmail.mockResolvedValue({ success: true });

    render(<VerifyEmail />);

    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
    expect(
      screen.getByText(/Verifying your email address\.\.\./i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith("valid-security-token-999");
      expect(mockNavigate).toHaveBeenCalledWith("/RegisteredPage");
    });
  });

  test("Branch B (API Operational Rejection): mounts explicit failure messages on operational issues", async () => {
    mockSearchString = "?token=expired-or-bad-token";
    verifyEmail.mockResolvedValue({
      success: false,
      message:
        "The validation token link has expired. Please request a new registration email.",
    });

    render(<VerifyEmail />);

    const customErrorMessage = await screen.findByText(
      /The validation token link has expired\./i,
    );
    expect(customErrorMessage).toBeInTheDocument();

    expect(
      screen.queryByRole("status", { hidden: true }),
    ).not.toBeInTheDocument();
  });

  test("Branch C (Network Exceptions): catches runtime errors gracefully and logs them directly inside error slots", async () => {
    mockSearchString = "?token=faulty-network-token";
    verifyEmail.mockRejectedValue(
      new Error(
        "Gateway connection dropped. Remote cluster connection timeout.",
      ),
    );

    render(<VerifyEmail />);

    const standardExceptionBlock = await screen.findByText(
      /Gateway connection dropped\./i,
    );
    expect(standardExceptionBlock).toBeInTheDocument();
  });

  test("Interactive Routing Layer: redirects applications backwards to root path arrays upon manual request clicks", async () => {
    mockSearchString = "";

    render(<VerifyEmail />);

    const redirectHomeBtn = screen.getByRole("button", {
      name: /Go to home page/i,
    });
    fireEvent.click(redirectHomeBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
