import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminPanel from "../AdminPanel";

jest.mock("../GetUsers", () => {
  return function DummyGetUsers({ onUserSelect, refreshTrigger }) {
    return (
      <div data-testid="mock-get-users">
        <span>Refresh Trigger: {refreshTrigger}</span>

        <button
          data-testid="select-user-btn"
          onClick={() => onUserSelect({ id: 1, name: "John Doe" })}
        >
          Select John Doe
        </button>
      </div>
    );
  };
});

jest.mock("../ManageUsers", () => {
  return function DummyManageUsers({
    selectedUser,
    onUserUpdated,
    onUserDeleted,
  }) {
    return (
      <div data-testid="mock-manage-users">
        <span data-testid="selected-user-display">
          Selected: {selectedUser ? selectedUser.name : "None"}
        </span>

        <button data-testid="update-user-btn" onClick={onUserUpdated}>
          Update User
        </button>
        <button data-testid="delete-user-btn" onClick={onUserDeleted}>
          Delete User
        </button>
      </div>
    );
  };
});

describe("AdminPanel Component Tests", () => {
  test("renders the header and both child components", () => {
    render(<AdminPanel />);

    const headerElement = screen.getByRole("heading", {
      name: /User Management/i,
    });
    expect(headerElement).toBeInTheDocument();
    expect(screen.getByTestId("mock-get-users")).toBeInTheDocument();
    expect(screen.getByTestId("mock-manage-users")).toBeInTheDocument();
  });

  test("passes initial states correctly to children (no user selected, refresh trigger at 0)", () => {
    render(<AdminPanel />);

    expect(screen.getByText("Refresh Trigger: 0")).toBeInTheDocument();
    expect(screen.getByTestId("selected-user-display")).toHaveTextContent(
      "Selected: None",
    );
  });

  test("updates selectedUser state when GetUsers fires onUserSelect", () => {
    render(<AdminPanel />);

    const selectButton = screen.getByTestId("select-user-btn");
    fireEvent.click(selectButton);

    expect(screen.getByTestId("selected-user-display")).toHaveTextContent(
      "Selected: John Doe",
    );
  });

  test("increments refreshUsersTrigger when ManageUsers fires onUserUpdated", () => {
    render(<AdminPanel />);

    const updateButton = screen.getByTestId("update-user-btn");
    fireEvent.click(updateButton);

    expect(screen.getByText("Refresh Trigger: 1")).toBeInTheDocument();
  });

  test("resets selectedUser and increments refreshUsersTrigger when ManageUsers fires onUserDeleted", () => {
    render(<AdminPanel />);

    fireEvent.click(screen.getByTestId("select-user-btn"));
    expect(screen.getByTestId("selected-user-display")).toHaveTextContent(
      "Selected: John Doe",
    );

    const deleteButton = screen.getByTestId("delete-user-btn");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("selected-user-display")).toHaveTextContent(
      "Selected: None",
    );
    expect(screen.getByText("Refresh Trigger: 1")).toBeInTheDocument();
  });
});
