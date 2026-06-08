import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetUsers from "../GetUsers";
import { getUsers as mockGetUsers } from "../ApiService";

jest.mock("../ApiService", () => ({
  getUsers: jest.fn(),
}));

describe("GetUsers Component Integration Tests", () => {
  const sampleUsers = [
    { id: 101, name: "Alice Vance", email: "alice@example.com" },
    { id: 102, name: "Bob Erickson", email: "bob@example.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner state on initial lifecycle mount", () => {
    mockGetUsers.mockReturnValueOnce(new Promise(() => {}));

    render(<GetUsers onUserSelect={jest.fn()} refreshTrigger={0} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("Fetching your users, this will just take a moment..."),
    ).toBeInTheDocument();
  });

  test("displays fallback announcement if the backend resolves zero user records", async () => {
    mockGetUsers.mockResolvedValueOnce({ success: true, users: [] });

    render(<GetUsers onUserSelect={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "No users yet. Once users are added, they’ll appear here.",
      ),
    ).toBeInTheDocument();
  });

  test("renders custom API message inside dismissible error alert panel upon service failure", async () => {
    mockGetUsers.mockResolvedValueOnce({
      success: false,
      message: "Session expired exception.",
    });

    render(<GetUsers onUserSelect={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText("Session expired exception.")).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByRole("alert")).not.none;
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("renders network exception fallback text when API execution rejects catastrophically", async () => {
    mockGetUsers.mockRejectedValueOnce(new Error("Database disconnected."));

    render(<GetUsers onUserSelect={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "We’re having trouble connecting to the server. Please try again shortly.",
      ),
    ).toBeInTheDocument();
  });

  test("populates drop-down list items correctly and executes parent callback pipelines on choice change", async () => {
    const mockOnUserSelect = jest.fn();
    mockGetUsers.mockResolvedValueOnce({ success: true, users: sampleUsers });

    render(<GetUsers onUserSelect={mockOnUserSelect} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const selectDropdown = screen.getByRole("combobox");
    expect(selectDropdown).toBeInTheDocument();
    expect(selectDropdown.value).toBe("");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Select a user");
    expect(options[1]).toHaveTextContent("Alice Vance");
    expect(options[2]).toHaveTextContent("Bob Erickson");

    fireEvent.change(selectDropdown, { target: { value: "102" } });

    expect(selectDropdown.value).toBe("102");
    expect(mockOnUserSelect).toHaveBeenCalledTimes(1);
    expect(mockOnUserSelect).toHaveBeenCalledWith({
      id: 102,
      name: "Bob Erickson",
      email: "bob@example.com",
    });
  });

  test("does not attempt to invoke the selection property callback if it is omitted or unprovided", async () => {
    mockGetUsers.mockResolvedValueOnce({ success: true, users: sampleUsers });

    render(<GetUsers refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.queryByRole("combobox")).toBeInTheDocument();
    });

    const selectDropdown = screen.getByRole("combobox");

    expect(() => {
      fireEvent.change(selectDropdown, { target: { value: "101" } });
    }).not.toThrow();

    expect(selectDropdown.value).toBe("101");
  });
});
