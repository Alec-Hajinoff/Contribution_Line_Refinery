import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ContributionsTimeline from "../ContributionsTimeline";
import { contributionsTimeline, presentationViewPost } from "../ApiService";

jest.mock("../ApiService", () => ({
  contributionsTimeline: jest.fn(),
  presentationViewPost: jest.fn(),
}));

jest.mock("../TimelineFilter", () => ({ filters, setFilters, onClear }) => (
  <div data-testid="timeline-filter">
    TimelineFilter
    <input
      aria-label="start date"
      type="date"
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, startDate: e.target.value }))
      }
    />
    <button onClick={onClear}>Clear Filters</button>
  </div>
));

jest.mock("../SelectedTally", () => ({ count, onDisplay, onCancel }) => (
  <div data-testid="selected-tally">
    Selected: {count}
    <button onClick={onDisplay}>Display Presentation</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));

jest.mock("../DeleteContribution", () => ({ contributionId, onDelete }) => (
  <button
    data-testid={`delete-${contributionId}`}
    onClick={() => onDelete(contributionId)}
  >
    Delete Mock
  </button>
));

jest.mock(
  "../UpdateContribution",
  () =>
    ({ contribution, onUpdate, onCancel }) =>
      (
        <div data-testid="update-form">
          Update Form for {contribution.title}
          <button
            onClick={() =>
              onUpdate({ ...contribution, title: "Updated Title" })
            }
          >
            Submit Update
          </button>
          <button onClick={onCancel}>Cancel Update</button>
        </div>
      ),
);

jest.mock("../CsvExport", () => () => (
  <div data-testid="csv-export">CsvExport</div>
));

window.open = jest.fn();

global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = jest.fn();

global.atob = jest.fn((str) => Buffer.from(str, "base64").toString("binary"));

describe("ContributionsTimeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  const mockContributions = [
    {
      id: 1,
      title: "Contribution A",
      contribution_date: "2024-01-01",
      created_at: "2024-02-01T10:00:00Z",
      categories: ["Leadership / Ownership"],
      what_happened: "Something happened",
      why_it_mattered: "It mattered",
      outcome_impact: "Big impact",
      current_role: "Senior dev",
      current_company: "ACME",
      evidence_links: [{ url: "https://example.com" }],
      files: [
        {
          file_name: "test.pdf",
          file_data: "YmFzZTY0",
          mime_type: "application/pdf",
        },
      ],
    },
  ];

  test("shows loading state and then contributions", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Contribution A")).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  test("shows error message when fetch fails", async () => {
    contributionsTimeline.mockRejectedValueOnce(new Error("API Error"));
    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("renders empty state when no contributions", async () => {
    contributionsTimeline.mockResolvedValueOnce([]);
    render(<ContributionsTimeline />);

    await waitFor(() => {
      expect(
        screen.getByText(/Start building your record/i),
      ).toBeInTheDocument();
    });
  });

  test("filters contributions by date", async () => {
    contributionsTimeline.mockResolvedValueOnce([
      ...mockContributions,
      {
        ...mockContributions[0],
        id: 2,
        title: "Old One",
        contribution_date: "2020-01-01",
      },
    ]);
    render(<ContributionsTimeline />);

    await waitFor(() => screen.getByText("Contribution A"));
    expect(screen.getByText("Old One")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2023-01-01" },
    });

    expect(screen.queryByText("Old One")).not.toBeInTheDocument();
    expect(screen.getByText("Contribution A")).toBeInTheDocument();
  });

  test("clears filters when onClear is called", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("Contribution A"));

    fireEvent.click(screen.getByText("Clear Filters"));

    expect(screen.getByTestId("timeline-filter")).toBeInTheDocument();
  });

  test("adds to presentation and displays it", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    presentationViewPost.mockResolvedValueOnce({
      status: "success",
      id: "view123",
    });

    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("Contribution A"));

    fireEvent.click(screen.getByText(/Add to presentation view/i));
    expect(screen.getByTestId("selected-tally")).toHaveTextContent(
      "Selected: 1",
    );

    fireEvent.click(screen.getByText("Display Presentation"));

    await waitFor(() => {
      expect(presentationViewPost).toHaveBeenCalledWith([1]);
    });
    expect(window.open).toHaveBeenCalledWith(
      "/PresentationView/view123",
      "_blank",
      "noopener,noreferrer",
    );
  });

  test("cancels presentation selection", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("Contribution A"));

    fireEvent.click(screen.getByText(/Add to presentation view/i));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByTestId("selected-tally")).not.toBeInTheDocument();
  });

  test("triggers file download", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("test.pdf"));

    fireEvent.click(screen.getByText("test.pdf"));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  test("opens update form and updates contribution", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("Contribution A"));

    fireEvent.click(screen.getByText("Update"));
    expect(screen.getByTestId("update-form")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Submit Update"));

    expect(screen.getByText("Updated Title")).toBeInTheDocument();
    expect(screen.queryByTestId("update-form")).not.toBeInTheDocument();
  });

  test("deletes contribution", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() => screen.getByText("Contribution A"));

    fireEvent.click(screen.getByTestId("delete-1"));

    expect(screen.queryByText("Contribution A")).not.toBeInTheDocument();
  });

  test("renders CSV export component", async () => {
    contributionsTimeline.mockResolvedValueOnce(mockContributions);
    render(<ContributionsTimeline />);
    await waitFor(() =>
      expect(screen.getByTestId("csv-export")).toBeInTheDocument(),
    );
  });
});
