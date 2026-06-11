import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import StatusUpdate from "../StatusUpdate";
import { statusUpdate } from "../ApiService";

if (typeof window !== "undefined") {
  if (!window.getSelection) {
    const mockSelection = () => ({
      removeAllRanges: () => {},
      addRange: () => {},
      getRangeAt: () => ({
        setStart: () => {},
        setEnd: () => {},
        cloneRange: () => ({
          collapse: () => {},
        }),
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
      commonAncestorContainer: {
        nodeName: "#document",
        type: "ELEMENT_NODE",
      },
    });
  }
}

jest.mock("../ApiService", () => ({
  statusUpdate: jest.fn(),
}));

describe("StatusUpdate Component Interaction and Lifecycle Tests", () => {
  const mockProjectId = "54321";
  const mockOnStatusUpdated = jest.fn();

  const defaultProps = {
    projectId: mockProjectId,
    currentStatus: "in_progress",
    onStatusUpdated: mockOnStatusUpdated,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("The Static Layer: renders active classes and checkbox settings based on initial props configuration", () => {
    const { unmount } = render(<StatusUpdate {...defaultProps} />);

    const toggleCheckbox = screen.getByRole("checkbox");
    expect(toggleCheckbox).not.toBeChecked();
    expect(screen.getByText("In progress")).toHaveClass("active");
    expect(screen.getByText("Completed")).not.toHaveClass("active");

    unmount();

    render(<StatusUpdate {...defaultProps} currentStatus="completed" />);

    const completedCheckbox = screen.getByRole("checkbox");
    expect(completedCheckbox).toBeChecked();
    expect(screen.getByText("Completed")).toHaveClass("active");
    expect(screen.getByText("In progress")).not.toHaveClass("active");
  });

  test("Branch A (Pending State): temporarily disables switch interactions and shows updating spinner indicators", async () => {
    statusUpdate.mockReturnValueOnce(new Promise(() => {}));
    const user = userEvent.setup();

    render(<StatusUpdate {...defaultProps} />);
    const toggleCheckbox = screen.getByRole("checkbox");

    await user.click(toggleCheckbox);

    expect(toggleCheckbox).toBeDisabled();

    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/Updating\.\.\./i)).toBeInTheDocument();
  });

  test("Branch B (Happy Path Success): resolves state modifications cleanly and fires upper-tier callback links", async () => {
    statusUpdate.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();

    render(<StatusUpdate {...defaultProps} />);
    const toggleCheckbox = screen.getByRole("checkbox");

    await user.click(toggleCheckbox);

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { hidden: true }),
      ).not.toBeInTheDocument();
    });

    expect(toggleCheckbox).not.toBeDisabled();
    expect(toggleCheckbox).toBeChecked();
    expect(screen.getByText("Completed")).toHaveClass("active");
    expect(mockOnStatusUpdated).toHaveBeenCalledWith(
      mockProjectId,
      "completed",
    );
    expect(statusUpdate).toHaveBeenCalledWith(mockProjectId, "completed");
  });

  test("Branch C (Broken Path Failure): catches API failure codes, triggers contextual warnings, and rolls back checkboxes", async () => {
    statusUpdate.mockResolvedValueOnce({
      success: false,
      message: "Unauthorized configuration permissions schema error.",
    });
    const user = userEvent.setup();

    render(<StatusUpdate {...defaultProps} />);
    const toggleCheckbox = screen.getByRole("checkbox");

    await user.click(toggleCheckbox);

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { hidden: true }),
      ).not.toBeInTheDocument();
    });

    const errorText = screen.getByText(
      /Unauthorized configuration permissions schema error\./i,
    );
    expect(errorText).toBeInTheDocument();

    expect(toggleCheckbox).not.toBeChecked();
    expect(screen.getByText("In progress")).toHaveClass("active");
    expect(mockOnStatusUpdated).not.toHaveBeenCalled();

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);

    expect(errorText).not.toBeInTheDocument();
  });

  test("Branch C (Catastrophic Exception Path): defends layout structures against unhandled request server crashes", async () => {
    statusUpdate.mockRejectedValueOnce(
      new Error("Database write connection failure exception"),
    );
    const user = userEvent.setup();

    render(<StatusUpdate {...defaultProps} />);
    const toggleCheckbox = screen.getByRole("checkbox");

    await user.click(toggleCheckbox);

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { hidden: true }),
      ).not.toBeInTheDocument();
    });

    const errorText = screen.getByText(
      /Database write connection failure exception/i,
    );
    expect(errorText).toBeInTheDocument();

    expect(toggleCheckbox).not.toBeChecked();
  });
});
