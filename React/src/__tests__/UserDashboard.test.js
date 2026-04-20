import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserDashboard from "../UserDashboard";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout">Mock Logout</div>
));

jest.mock("../AddContribution", () => ({ onContributionAdded }) => (
  <div data-testid="add-contribution">
    Mock AddContribution
    <button onClick={onContributionAdded}>Trigger Add</button>
  </div>
));

const mockTimeline = jest.fn(() => (
  <div data-testid="timeline">Mock Timeline</div>
));

jest.mock("../ContributionsTimeline", () => ({
  __esModule: true,
  default: (props) => mockTimeline(props),
}));

describe("UserDashboard", () => {
  beforeEach(() => {
    mockTimeline.mockClear();
  });

  test("renders LogoutComponent, AddContribution, and ContributionsTimeline", () => {
    render(<UserDashboard />);

    expect(screen.getByTestId("logout")).toBeInTheDocument();
    expect(screen.getByTestId("add-contribution")).toBeInTheDocument();
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
  });

  test("re-mounts ContributionsTimeline when a contribution is added", () => {
    render(<UserDashboard />);

    expect(mockTimeline).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Trigger Add"));

    expect(mockTimeline).toHaveBeenCalledTimes(2);
  });
});
