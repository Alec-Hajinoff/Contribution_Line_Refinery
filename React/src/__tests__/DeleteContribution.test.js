import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteContribution from "../DeleteContribution";
import { deleteContribution } from "../ApiService";

jest.mock("../ApiService", () => ({
  deleteContribution: jest.fn(),
}));

describe("DeleteContribution", () => {
  const contributionId = 123;
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders delete button initially", () => {
    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("shows confirmation message when delete is clicked", () => {
    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.getByText(/Sure\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("hides confirmation when cancel is clicked", () => {
    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByText(/Sure\?/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("calls API and invokes onDelete on success", async () => {
    deleteContribution.mockResolvedValueOnce({ status: "success" });

    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByText("...")).toBeInTheDocument();

    await waitFor(() => {
      expect(deleteContribution).toHaveBeenCalledWith(contributionId);
      expect(mockOnDelete).toHaveBeenCalledWith(contributionId);
    });
  });

  test("displays error message on API failure status", async () => {
    deleteContribution.mockResolvedValueOnce({
      status: "error",
      message: "Denied",
    });

    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText("Denied")).toBeInTheDocument();
    });
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test("displays error message on network/exception error", async () => {
    deleteContribution.mockRejectedValueOnce(new Error("Network Fail"));

    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText("Network Fail")).toBeInTheDocument();
    });
  });

  test("dismisses error message when dismiss button is clicked", async () => {
    deleteContribution.mockRejectedValueOnce(new Error("Error"));

    render(
      <DeleteContribution
        contributionId={contributionId}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    const dismissBtn = await screen.findByRole("button", { name: /dismiss/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
