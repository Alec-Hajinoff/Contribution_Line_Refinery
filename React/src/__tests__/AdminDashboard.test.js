import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminDashboard from "../AdminDashboard";

jest.mock("../AdminPanel", () => {
  return function DummyAdminPanel() {
    return <div data-testid="mock-admin-panel">Mocked Admin Panel</div>;
  };
});

jest.mock("../GetProjects", () => {
  return function DummyGetProjects({ refreshTrigger, isAdminView }) {
    return (
      <div data-testid="mock-get-projects">
        Mocked Get Projects
        <span data-testid="trigger-val">{refreshTrigger}</span>
        <span data-testid="admin-view-val">
          {isAdminView ? "true" : "false"}
        </span>
      </div>
    );
  };
});

describe("AdminDashboard Component Tests", () => {
  test("renders the welcome text and layout structure", () => {
    render(<AdminDashboard />);

    const welcomeText = screen.getByText(/Welcome to your admin dashboard/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test("renders the child sub-components (AdminPanel and GetProjects)", () => {
    render(<AdminDashboard />);

    const adminPanel = screen.getByTestId("mock-admin-panel");
    const getProjects = screen.getByTestId("mock-get-projects");

    expect(adminPanel).toBeInTheDocument();
    expect(getProjects).toBeInTheDocument();
  });

  test("passes the correct initial props to the GetProjects component", () => {
    render(<AdminDashboard />);

    const triggerValue = screen.getByTestId("trigger-val");
    const adminViewValue = screen.getByTestId("admin-view-val");

    expect(triggerValue).toHaveTextContent("0");
    expect(adminViewValue).toHaveTextContent("true");
  });
});
