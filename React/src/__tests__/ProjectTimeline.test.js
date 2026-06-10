import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectTimeline from "../ProjectTimeline";
import { projectTimeline } from "../ApiService";

jest.mock("../ApiService", () => ({
  projectTimeline: jest.fn(),
}));

describe("ProjectTimeline Component Content and Lifecycle Stream Tests", () => {
  const mockProjectId = "98765";
  const defaultProps = {
    projectId: mockProjectId,
    refreshTrigger: 0,
  };

  const sampleMessages = [
    {
      id: 101,
      author_name: "John Doe",
      created_at: "2026-03-15T14:30:00Z",
      message: "First line of update.\nSecond line of update.",
      attachments: [
        {
          id: 1,
          attachment_name: "specification.pdf",
          view_url: "https://example.com/view/spec.pdf",
          download_url: "https://example.com/download/spec.pdf",
        },
      ],
    },
    {
      id: 102,
      author_name: "Jane Smith",
      created_at: "2026-03-14T09:15:00Z",
      message: "Single line request update.",
      attachments: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Branch A: displays the loading indicator spinner panel while the promise request is pending", () => {
    projectTimeline.mockReturnValueOnce(new Promise(() => {}));

    render(<ProjectTimeline {...defaultProps} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/Loading updates\.\.\./i)).toBeInTheDocument();
  });

  test("Branch B: displays an empty status fallback layout when the server timeline collection is empty", async () => {
    projectTimeline.mockResolvedValueOnce({ success: true, messages: [] });

    render(<ProjectTimeline {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/No updates or requests yet\./i),
    ).toBeInTheDocument();
    expect(projectTimeline).toHaveBeenCalledWith(mockProjectId);
  });

  test("Branch C: renders a timeline feed with custom line breaks and structured attachment anchors upon success", async () => {
    projectTimeline.mockResolvedValueOnce({
      success: true,
      messages: sampleMessages,
    });

    render(<ProjectTimeline {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /Project Updates/i, level: 5 }),
    ).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    expect(screen.getByText("15/03/2026, 14:30")).toBeInTheDocument();
    expect(screen.getByText("14/03/2026, 09:15")).toBeInTheDocument();

    expect(screen.getByText("First line of update.")).toBeInTheDocument();
    expect(screen.getByText("Second line of update.")).toBeInTheDocument();

    expect(screen.getByText(/specification\.pdf/i)).toBeInTheDocument();

    const viewAnchor = screen.getByRole("link", { name: /View/i });
    expect(viewAnchor).toHaveAttribute(
      "href",
      "https://example.com/view/spec.pdf",
    );
    expect(viewAnchor).toHaveAttribute("target", "_blank");

    const downloadAnchor = screen.getByRole("link", { name: /Download/i });
    expect(downloadAnchor).toHaveAttribute(
      "href",
      "https://example.com/download/spec.pdf",
    );
    expect(downloadAnchor).toHaveAttribute("download");
  });

  test("Branch d: captures a custom error notification container if the API response failure flag is passed", async () => {
    projectTimeline.mockResolvedValueOnce({
      success: false,
      message: "Custom backend connection error layout.",
    });

    render(<ProjectTimeline {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const alertBox = screen.getByRole("alert");
    expect(alertBox).toBeInTheDocument();
    expect(alertBox).toHaveTextContent(
      /Custom backend connection error layout\./i,
    );

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(
      screen.getByText(/No updates or requests yet\./i),
    ).toBeInTheDocument();
  });

  test("Branch D (Fallback): handles hard network exceptions with fallback communication text arrays", async () => {
    projectTimeline.mockRejectedValueOnce(
      new Error("Network catastrophic crash"),
    );

    render(<ProjectTimeline {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      /We’re having trouble loading your project updates and requests at the moment\. Please try again shortly\./i,
    );
  });
});
