import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageUsers from "../ManageUsers";
import {
  manageUsers as mockManageUsers,
  updateUserName as mockUpdateUserName,
  userDeletion as mockUserDeletion,
} from "../ApiService";

jest.mock("../ApiService", () => ({
  manageUsers: jest.fn(),
  updateUserName: jest.fn(),
  userDeletion: jest.fn(),
}));

describe("ManageUsers Component State and Action Tests", () => {
  const activeUserSample = { id: 45, name: "David Miller" };
  const expandedUserPayload = {
    id: 45,
    name: "David Miller",
    email: "david@example.com",
  };

  const mockOnUserUpdated = jest.fn();
  const mockOnUserDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("returns an empty null element frame if no selected profile is provided", () => {
    const { container } = render(
      <ManageUsers
        selectedUser={null}
        onUserUpdated={mockOnUserUpdated}
        onUserDeleted={mockOnUserDeleted}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("shows a loading spinner indicator upon profile prop loading", () => {
    mockManageUsers.mockReturnValueOnce(new Promise(() => {}));

    render(<ManageUsers selectedUser={activeUserSample} />);

    expect(
      screen.getByText("Loading user details, just a moment..."),
    ).toBeInTheDocument();
  });

  test("displays a server message notice panel if metadata tracking requests fail on mount", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: false,
      message: "Database clearance restriction.",
    });

    render(<ManageUsers selectedUser={activeUserSample} />);

    await waitFor(() => {
      expect(
        screen.getByText("Database clearance restriction."),
      ).toBeInTheDocument();
    });
  });

  test("renders name, contact emails, and action handlers successfully on successful resolution", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: true,
      user: expandedUserPayload,
    });

    render(<ManageUsers selectedUser={activeUserSample} />);

    await waitFor(() => {
      expect(screen.getByText("David Miller")).toBeInTheDocument();
    });
    expect(screen.getByText("david@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete user" }),
    ).toBeInTheDocument();
  });

  test("toggles inline edit view and updates user records successfully", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: true,
      user: expandedUserPayload,
    });
    mockUpdateUserName.mockResolvedValueOnce({ success: true });

    render(
      <ManageUsers
        selectedUser={activeUserSample}
        onUserUpdated={mockOnUserUpdated}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("David Miller")).toBeInTheDocument();
    });

    const editIconButton = screen.getByTitle("Edit name");
    fireEvent.click(editIconButton);

    const nameInputField = screen.getByRole("textbox");
    expect(nameInputField.value).toBe("David Miller");

    fireEvent.change(nameInputField, { target: { value: "David Miller Jr." } });
    const checkmarkSaveBtn = screen.getByRole("button", { name: "✓" });
    fireEvent.click(checkmarkSaveBtn);

    expect(mockUpdateUserName).toHaveBeenCalledWith(45, "David Miller Jr.");
    await waitFor(() => {
      expect(screen.getByText("David Miller Jr.")).toBeInTheDocument();
    });
    expect(mockOnUserUpdated).toHaveBeenCalledTimes(1);
  });

  test("reverts structural name updates back to baseline text if edits are canceled", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: true,
      user: expandedUserPayload,
    });

    render(<ManageUsers selectedUser={activeUserSample} />);
    await waitFor(() => {
      expect(screen.getByText("David Miller")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle("Edit name"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Discardable text modifications" },
    });
    fireEvent.click(screen.getByRole("button", { name: "✗" }));

    expect(screen.getByText("David Miller")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  test("triggers short-lived error popups if empty input is saved", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: true,
      user: expandedUserPayload,
    });

    render(<ManageUsers selectedUser={activeUserSample} />);
    await waitFor(() => {
      expect(screen.getByTitle("Edit name")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle("Edit name"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "✓" }));

    expect(
      screen.getByText("Please enter a name before saving."),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText("Please enter a name before saving."),
    ).not.toBeInTheDocument();
  });

  test("coordinates a delete confirmation workflow sequence before calling the removal API", async () => {
    mockManageUsers.mockResolvedValueOnce({
      success: true,
      user: expandedUserPayload,
    });
    mockUserDeletion.mockResolvedValueOnce({ success: true });

    render(
      <ManageUsers
        selectedUser={activeUserSample}
        onUserUpdated={mockOnUserUpdated}
        onUserDeleted={mockOnUserDeleted}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete user" }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete user" }));

    const confirmBtn = screen.getByRole("button", { name: "Delete user" });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(confirmBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    expect(mockUserDeletion).toHaveBeenCalledWith(45);
    await waitFor(() => {
      expect(mockOnUserDeleted).toHaveBeenCalledTimes(1);
    });
    expect(mockOnUserUpdated).toHaveBeenCalledTimes(1);
  });
});
