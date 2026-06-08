import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetProjects from "../GetProjects";
import { getProjects as mockGetProjects } from "../ApiService";

jest.mock("../ApiService", () => ({
  getProjects: jest.fn(),
}));

jest.mock("../ProjectMessages", () => () => (
  <div data-testid="mock-messages" />
));
jest.mock("../ProjectTimeline", () => () => (
  <div data-testid="mock-timeline" />
));
jest.mock("../StatusUpdate", () => ({ onStatusUpdated, projectId }) => (
  <button
    data-testid="mock-status-update"
    onClick={() => onStatusUpdated(projectId, "Completed")}
  >
    Change Status Trigger
  </button>
));

describe("GetProjects Component Integration Tests", () => {
  const sampleProjects = [
    {
      id: 1,
      title: "E-Commerce Pipeline Conversion",
      status: "in_progress",
      created_at: "2026-05-15T12:00:00.000Z",
      client_name: "Acme Corporate Ltd",
      description: "Migrating legacy databases\ninto modern REST schemas.",
      attachments: [
        {
          id: 101,
          attachment_name: "architecture_blueprint.pdf",
          view_url: "https://example.com/view/101",
          download_url: "https://example.com/download/101",
        },
      ],
    },
    {
      id: 2,
      title: "Static Marketing Landing Hub",
      status: "Completed",
      created_at: "2026-06-01T09:30:00.000Z",
      client_name: "Beta Launch Labs",
      description: "High conversion optimization layouts.",
      attachments: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner state indicators on initial asynchronous transit mount", async () => {
    mockGetProjects.mockReturnValueOnce(new Promise(() => {}));

    render(<GetProjects refreshTrigger={0} />);

    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays fallback text prompt if the api returns successfully with zero active records", async () => {
    mockGetProjects.mockResolvedValueOnce({ success: true, projects: [] });

    render(<GetProjects refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading projects...")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Your projects will appear here"),
    ).toBeInTheDocument();
  });

  test("renders server error alert banner if the resolved API success parameter flag is false", async () => {
    mockGetProjects.mockResolvedValueOnce({
      success: false,
      message: "Database authentication failure exception.",
    });

    render(<GetProjects refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Database authentication failure exception."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("renders fallback error banner if the transit network Promise throws a catastrophic rejection", async () => {
    mockGetProjects.mockRejectedValueOnce(new Error("Connection Timeout."));

    render(<GetProjects refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "We’re sorry, but we couldn’t retrieve your projects right now. Please try again in a few moments.",
      ),
    ).toBeInTheDocument();
  });

  test("renders standard user dashboard header and lists active project title summary rows safely", async () => {
    mockGetProjects.mockResolvedValueOnce({
      success: true,
      projects: sampleProjects,
    });

    render(<GetProjects refreshTrigger={0} isAdminView={false} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "My Projects",
      );
    });

    expect(
      screen.getByText("E-Commerce Pipeline Conversion"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Static Marketing Landing Hub"),
    ).toBeInTheDocument();

    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    expect(screen.getByText("15/05/2026")).toBeInTheDocument();
    expect(screen.getByText("01/06/2026")).toBeInTheDocument();
  });

  test("toggles expanded details view layout accordion branches open and shut cleanly upon card header clicks", async () => {
    mockGetProjects.mockResolvedValueOnce({
      success: true,
      projects: sampleProjects,
    });
    render(<GetProjects refreshTrigger={0} isAdminView={false} />);

    await waitFor(() => {
      expect(
        screen.getByText("E-Commerce Pipeline Conversion"),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Project brief:")).not.toBeInTheDocument();

    const firstProjectHeader = screen.getByText(
      "E-Commerce Pipeline Conversion",
    );
    fireEvent.click(firstProjectHeader);

    expect(screen.getByText("Project brief:")).toBeInTheDocument();
    expect(screen.getByText("Migrating legacy databases")).toBeInTheDocument();

    const lineBreakElements = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === "br";
    });
    expect(lineBreakElements.length).toBe(2);
    expect(lineBreakElements[0]).toBeInTheDocument();

    expect(screen.getByText("architecture_blueprint.pdf")).toBeInTheDocument();
    const viewAnchor = screen.getByRole("link", { name: /view/i });
    const downloadAnchor = screen.getByRole("link", { name: /download/i });

    expect(viewAnchor).toHaveAttribute("href", "https://example.com/view/101");
    expect(downloadAnchor).toHaveAttribute(
      "href",
      "https://example.com/download/101",
    );

    expect(screen.getByTestId("mock-messages")).toBeInTheDocument();
    expect(screen.getByTestId("mock-timeline")).toBeInTheDocument();

    fireEvent.click(firstProjectHeader);
    expect(screen.queryByText("Project brief:")).not.toBeInTheDocument();
  });

  test("renders alternative attachment notice string if attachment list arrays resolve empty", async () => {
    mockGetProjects.mockResolvedValueOnce({
      success: true,
      projects: sampleProjects,
    });
    render(<GetProjects refreshTrigger={0} isAdminView={false} />);

    await waitFor(() => {
      expect(
        screen.getByText("Static Marketing Landing Hub"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Static Marketing Landing Hub"));

    expect(screen.getByText("No attachments uploaded")).toBeInTheDocument();
  });

  test("renders client name identifiers and triggers inline status context updates when viewed in admin configuration mode", async () => {
    mockGetProjects.mockResolvedValueOnce({
      success: true,
      projects: sampleProjects,
    });
    render(<GetProjects refreshTrigger={0} isAdminView={true} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "All Projects",
      );
    });

    fireEvent.click(screen.getByText("E-Commerce Pipeline Conversion"));

    expect(screen.getByText("Client:")).toBeInTheDocument();
    expect(screen.getByText("Acme Corporate Ltd")).toBeInTheDocument();

    const statusModifierButton = screen.getByTestId("mock-status-update");
    expect(statusModifierButton).toBeInTheDocument();

    const initialStatusElements = screen.getAllByText("In progress");
    expect(initialStatusElements.length).toBeGreaterThan(0);

    fireEvent.click(statusModifierButton);

    expect(screen.queryByText("In progress")).not.toBeInTheDocument();
    expect(screen.getAllByText("Completed").length).toBe(2);
  });
});
