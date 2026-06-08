import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactForm from "../ContactForm";
import { contactForm as mockContactForm } from "../ApiService";

jest.mock("../ApiService", () => ({
  contactForm: jest.fn(),
}));

describe("ContactForm Component Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders initial structural state, headings, inputs, and word count safely", () => {
    render(<ContactForm />);

    expect(
      screen.getByText(
        /Send me a brief outline of your project to start the conversation/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("0/100 words")).toBeInTheDocument();
  });

  test("dynamically increments descriptive word count as the client types", () => {
    render(<ContactForm />);
    const textarea = screen.getByPlaceholderText(
      "Please describe your project (up to 100 words)",
    );

    fireEvent.change(textarea, {
      target: { value: "Building a React app layout" },
    });

    expect(screen.getByText("5/100 words")).toBeInTheDocument();
  });

  test("blocks submission and shows a validation error if the name contains invalid numeric digits", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.getByText(
        "Please enter a valid name using letters, spaces, hyphens, or apostrophes only.",
      ),
    ).toBeInTheDocument();
    expect(mockContactForm).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a valid name using letters, spaces, hyphens, or apostrophes only.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  test("blocks submission and shows validation error if email formatting is malformed", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john.doe@com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.getByText(
        "Please enter a valid email address (for example, name@domain.com).",
      ),
    ).toBeInTheDocument();
    expect(mockContactForm).not.toHaveBeenCalled();
  });

  test("blocks submission if phone number does not fall within standard lengths or patterns", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.getByText(
        "Please enter a valid phone number (8–20 digits, including optional +, -, spaces, or parentheses).",
      ),
    ).toBeInTheDocument();
  });

  test("blocks submission and prompts user if project description textarea copy is completely blank", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "+44 7123 456789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.getByText("Please provide a brief description of your project."),
    ).toBeInTheDocument();
  });

  test("blocks submission if word limit threshold exceeds 100 maximum bounds", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "+44 7123 456789" },
    });

    const overLimitDescription = "word ".repeat(101);
    fireEvent.change(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ),
      {
        target: { value: overLimitDescription },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.getByText(
        "Your project description should be 100 words or fewer.",
      ),
    ).toBeInTheDocument();
    expect(mockContactForm).not.toHaveBeenCalled();
  });

  test("successfully submits form payload, displays success banner, resets states, and handles spin loader state flags", async () => {
    mockContactForm.mockResolvedValueOnce({ success: true });
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "+44 7123 456789" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ),
      {
        target: {
          value:
            "I need a high performance portfolio system built using PHP and modern React rendering pipelines.",
        },
      },
    );

    const submitButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Sending");
    expect(screen.getByRole("status", { hidden: true })).toHaveClass(
      "d-inline-block",
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /Thank you for your message. I’ll be in touch within 24 hours./i,
        ),
      ).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Your full name").value).toBe("");
    expect(screen.getByPlaceholderText("Email address").value).toBe("");
    expect(screen.getByPlaceholderText("Phone number").value).toBe("");
    expect(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ).value,
    ).toBe("");
    expect(screen.getByText("0/100 words")).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(
        screen.queryByText(
          /Thank you for your message. I’ll be in touch within 24 hours./i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  test("displays custom error feedback message if database API resolves explicitly with false flag", async () => {
    mockContactForm.mockResolvedValueOnce({
      success: false,
      message: "Custom database failure.",
    });
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "+44 7123 456789" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ),
      {
        target: { value: "Valid description copy contents." },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText("Custom database failure.")).toBeInTheDocument();
    });
  });

  test("handles catastrophic Promise rejection exception handlers during asynchronous transit", async () => {
    mockContactForm.mockRejectedValueOnce(
      new Error("Network connection dropped."),
    );
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "john@domain.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "+44 7123 456789" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        "Please describe your project (up to 100 words)",
      ),
      {
        target: { value: "Valid description copy contents." },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Network connection dropped."),
      ).toBeInTheDocument();
    });
  });
});
