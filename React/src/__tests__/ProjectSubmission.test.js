import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProjectSubmission from "../ProjectSubmission";
import { projectSubmission } from "../ApiService";

if (typeof window !== "undefined" && !window.getSelection) {
  const mockSelection = () => ({
    removeAllRanges: () => {},
    addRange: () => {},
    getRangeAt: () => ({}),
  });
  window.getSelection = mockSelection;
  document.getSelection = mockSelection;
}

jest.mock("../ApiService", () => ({
  projectSubmission: jest.fn(),
}));

describe("ProjectSubmission Component Form Verification and Workflow Tests", () => {
  const mockOnProjectSubmitted = jest.fn();
  const defaultProps = {
    onProjectSubmitted: mockOnProjectSubmitted,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the structural layout card, expected input form elements, and fallback helper texts", () => {
    render(<ProjectSubmission {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /Start a New Project/i, level: 4 }),
    ).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Project name or title/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute("type", "text");
    expect(titleInput).toHaveAttribute("maxLength", "255");
    expect(titleInput).toHaveAttribute(
      "placeholder",
      "Give your project a name",
    );

    const descTextarea = screen.getByLabelText(/Project brief/i);
    expect(descTextarea).toBeInTheDocument();
    expect(descTextarea).toBeRequired();
    expect(descTextarea).toHaveAttribute(
      "placeholder",
      "Describe your requirements in detail",
    );

    const fileInput = screen.getByLabelText(/Attachments \(optional\)/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", ".png,.jpg,.jpeg,.pdf");
    expect(
      screen.getByText(
        /Accepted formats: PNG, JPEG, PDF\. Max 10MB per file\. Up to 5 files\./i,
      ),
    ).toBeInTheDocument();
  });

  test("displays an explicit validation message block if a blank title field is dispatched", async () => {
    const user = userEvent.setup();

    render(<ProjectSubmission {...defaultProps} />);

    const submitBtn = screen.getByRole("button", { name: /^Submit$/i });
    await user.click(submitBtn);

    expect(projectSubmission).not.toHaveBeenCalled();

    const errBlock = screen.getByText((content, element) => {
      return (
        element.id === "error-message" &&
        /Please enter a project title\./i.test(content)
      );
    });
    expect(errBlock).toBeInTheDocument();
  });

  test("displays an explicit validation message block if title is provided but the brief is left blank", async () => {
    const user = userEvent.setup();

    render(<ProjectSubmission {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Project name or title/i);
    await user.type(titleInput, "Hertford Infrastructure Platform");

    const submitBtn = screen.getByRole("button", { name: /^Submit$/i });
    await user.click(submitBtn);

    expect(projectSubmission).not.toHaveBeenCalled();

    const errBlock = screen.getByText((content, element) => {
      return (
        element.id === "error-message" &&
        /Please provide a brief description of your project\./i.test(content)
      );
    });
    expect(errBlock).toBeInTheDocument();
  });

  test("rejects selected attachment elements if files exceed size limits or fail validation filters", async () => {
    const user = userEvent.setup();

    render(<ProjectSubmission {...defaultProps} />);

    const fileInput = screen.getByLabelText(/Attachments \(optional\)/i);

    const validImg = new File(["valid-data"], "logo_thumbnail.jpg", {
      type: "image/jpeg",
    });
    const hugePdf = new File(
      ["x".repeat(11 * 1024 * 1024)],
      "blueprints_v2.pdf",
      { type: "application/pdf" },
    );

    await user.upload(fileInput, [validImg, hugePdf]);

    expect(
      screen.getByText(
        /1 file\(s\) added\..*couldn’t be uploaded due to type or size restrictions/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /blueprints_v2\.pdf is too large\. Each file must be under 10MB\./i,
      ),
    ).toBeInTheDocument();
  });

  test("supports dynamic processing states when a submission transaction is pending and resets successfully", async () => {
    const user = userEvent.setup();

    let resolveApiSubmission;
    const apiPromise = new Promise((resolve) => {
      resolveApiSubmission = resolve;
    });
    projectSubmission.mockReturnValueOnce(apiPromise);

    render(<ProjectSubmission {...defaultProps} />);

    const titleInput = screen.getByLabelText(/Project name or title/i);
    const descTextarea = screen.getByLabelText(/Project brief/i);

    await user.type(titleInput, "E-Commerce Pipeline Expansion");
    await user.type(
      descTextarea,
      "Requirements include upgrading PHP microservices to handle modern API payloads.",
    );

    const submitBtn = screen.getByRole("button", { name: /^Submit$/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(/Submitting your project please wait\.\.\./i),
    ).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    resolveApiSubmission({ success: true });

    await waitFor(() => {
      expect(projectSubmission).toHaveBeenCalledWith({
        title: "E-Commerce Pipeline Expansion",
        description:
          "Requirements include upgrading PHP microservices to handle modern API payloads.",
        attachments: [],
      });
    });

    expect(
      screen.getByText(
        /Your project "E-Commerce Pipeline Expansion" has been submitted successfully\./i,
      ),
    ).toBeInTheDocument();
    expect(titleInput).toHaveValue("");
    expect(descTextarea).toHaveValue("");
    expect(mockOnProjectSubmitted).toHaveBeenCalledTimes(1);
  });
});
