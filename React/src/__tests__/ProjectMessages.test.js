import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProjectMessages from "../ProjectMessages";
import { projectMessages } from "../ApiService";

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
  projectMessages: jest.fn(),
}));

describe("ProjectMessages Component Content and Messaging Workflow Tests", () => {
  const mockOnMessageSubmitted = jest.fn();
  const defaultProps = {
    projectId: "12345",
    onMessageSubmitted: mockOnMessageSubmitted,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the structural container panel, input form fields, and explanatory validation criteria", () => {
    render(<ProjectMessages {...defaultProps} />);

    expect(
      screen.getByRole("heading", {
        name: /Share an Update or Request a Change/i,
        level: 5,
      }),
    ).toBeInTheDocument();

    const txtArea = screen.getByLabelText(/Describe your update or request/i);
    expect(txtArea).toBeInTheDocument();
    expect(txtArea).toHaveAttribute(
      "placeholder",
      expect.stringContaining("Describe the update, change, or question"),
    );
    expect(txtArea).toBeRequired();

    const fileInput = screen.getByLabelText(/Attachments \(Optional\)/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", ".png,.jpg,.jpeg,.pdf");

    expect(
      screen.getByText(
        /Accepted formats: PNG, JPEG, PDF\. Max 10MB per file\. Up to 5 files\./i,
      ),
    ).toBeInTheDocument();
  });

  test("displays an explicit validation message block if an empty text area is dispatched", async () => {
    const user = userEvent.setup();

    render(<ProjectMessages {...defaultProps} />);

    const sendBtn = screen.getByRole("button", { name: /^Send$/i });
    await user.click(sendBtn);

    expect(projectMessages).not.toHaveBeenCalled();

    const errMessage = screen.getByText((content, element) => {
      return (
        element.id === "pm-error-message" &&
        /Please enter a message before submitting/i.test(content)
      );
    });
    expect(errMessage).toBeInTheDocument();
  });

  test("rejects invalid files based on size rules and custom layout filters", async () => {
    const user = userEvent.setup();

    render(<ProjectMessages {...defaultProps} />);

    const fileInput = screen.getByLabelText(/Attachments \(Optional\)/i);

    const validImg = new File(["valid"], "picture.png", { type: "image/png" });
    const hugePdf = new File(["a".repeat(11 * 1024 * 1024)], "massive.pdf", {
      type: "application/pdf",
    });

    await user.upload(fileInput, [validImg, hugePdf]);

    expect(
      screen.getByText(
        /1 file\(s\) added\. 1 couldn’t be uploaded due to format or size limits\./i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /massive\.pdf is too large\. Please upload files under 10MB\./i,
      ),
    ).toBeInTheDocument();
  });

  test("supports custom attachments and permits removing individual files before transmission", async () => {
    const user = userEvent.setup();

    render(<ProjectMessages {...defaultProps} />);

    const fileInput = screen.getByLabelText(/Attachments \(Optional\)/i);
    const mockFile = new File(["attachment-content"], "test-spec.pdf", {
      type: "application/pdf",
    });

    await user.upload(fileInput, mockFile);

    expect(screen.getByText(/Selected files.*1.*5/i)).toBeInTheDocument();
    expect(screen.getByText(/test-spec\.pdf/i)).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: /Remove file/i });
    await user.click(removeBtn);

    expect(
      screen.getByText(/Your file has been removed\./i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/test-spec\.pdf/i)).not.toBeInTheDocument();
  });

  test("manages progress states during an active submission stream and empties form layouts upon success", async () => {
    const user = userEvent.setup();

    let resolveApi;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    projectMessages.mockReturnValueOnce(apiPromise);

    render(<ProjectMessages {...defaultProps} />);

    const txtArea = screen.getByLabelText(/Describe your update or request/i);
    await user.type(txtArea, "Deploying database changes down to pipeline.");

    const sendBtn = screen.getByRole("button", { name: /^Send$/i });
    await user.click(sendBtn);

    expect(screen.getByText(/Sending\.\.\./i)).toBeInTheDocument();
    expect(sendBtn).toBeDisabled();

    resolveApi({ success: true });

    await waitFor(() => {
      expect(projectMessages).toHaveBeenCalledWith("12345", {
        message: "Deploying database changes down to pipeline.",
        attachments: [],
      });
    });

    expect(
      screen.getByText(/Your update has been sent successfully\./i),
    ).toBeInTheDocument();
    expect(txtArea).toHaveValue("");
    expect(mockOnMessageSubmitted).toHaveBeenCalledTimes(1);
  });
});
