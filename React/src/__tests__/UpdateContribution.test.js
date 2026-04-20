import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import UpdateContribution from "../UpdateContribution";
import { updateContribution } from "../ApiService";

jest.mock("../ApiService", () => ({
  updateContribution: jest.fn(),
}));

describe("UpdateContribution Component", () => {
  const mockContribution = {
    id: 1,
    title: "Old Title",
    what_happened: "Old What",
    why_it_mattered: "Old Why",
    outcome_impact: "Old Impact",
    contribution_date: "2024-01-01",
    categories: ["Leadership / Ownership"],
    evidence_links: [{ url: "https://old.com" }],
    current_role: "Dev",
    current_company: "Old Co",
    created_at: "2024-01-01T00:00:00Z",
    files: [{ file_name: "old_file.pdf" }],
  };

  const mockOnUpdate = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders with initial values from the contribution prop", () => {
    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old What")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Why")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Impact")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://old.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dev")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Co")).toBeInTheDocument();

    expect(screen.getByLabelText("Leadership / Ownership")).toBeChecked();
  });

  test("allows the user to change form fields", () => {
    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    const titleInput = screen.getByDisplayValue("Old Title");
    fireEvent.change(titleInput, {
      target: { value: "New Title", name: "title" },
    });
    expect(titleInput).toHaveValue("New Title");
  });

  test("handles category checkbox changes correctly", () => {
    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    const coreRoleCheckbox = screen.getByLabelText(
      "Core Role / Job Performance",
    );
    const leadershipCheckbox = screen.getByLabelText("Leadership / Ownership");

    fireEvent.click(coreRoleCheckbox);
    expect(coreRoleCheckbox).toBeChecked();

    fireEvent.click(leadershipCheckbox);
    expect(leadershipCheckbox).not.toBeChecked();
  });

  test("validates file size and type when replacing a file", () => {
    const { container } = render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByText(/Replace/i));

    const fileInput = container.querySelector('input[type="file"]');

    const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(window.alert).toHaveBeenCalledWith("File size exceeds 10MB limit.");

    const exeFile = new File(["dummy content"], "test.exe", {
      type: "application/x-msdownload",
    });
    fireEvent.change(fileInput, { target: { files: [exeFile] } });
    expect(window.alert).toHaveBeenCalledWith(
      "Only PDF, JPG, and PNG files are allowed.",
    );
  });

  test("allows removing the current supporting file", () => {
    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("old_file.pdf")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Remove/i));

    expect(screen.queryByText("old_file.pdf")).not.toBeInTheDocument();
  });

  test("successfully submits changes and calls onUpdate after success message", async () => {
    const updatedContribution = { ...mockContribution, title: "Updated Title" };
    updateContribution.mockResolvedValueOnce({
      status: "success",
      contribution: updatedContribution,
    });

    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    const titleInput = screen.getByDisplayValue("Old Title");
    fireEvent.change(titleInput, {
      target: { value: "Updated Title", name: "title" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Save changes/i }));

    expect(await screen.findByText(/Saving/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(updateContribution).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Saved successfully/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(updatedContribution);
  });

  test("displays an error message when the API update fails", async () => {
    updateContribution.mockResolvedValueOnce({ status: "error" });

    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: /Save changes/i }));

    expect(await screen.findByText(/Error saving/i)).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test("calls onCancel when the cancel button is clicked", () => {
    render(
      <UpdateContribution
        contribution={mockContribution}
        onUpdate={mockOnUpdate}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
