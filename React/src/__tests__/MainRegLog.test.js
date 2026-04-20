import React from "react";
import { render, screen } from "@testing-library/react";

import MainRegLog from "../MainRegLog";

jest.mock("../Main", () => () => <div data-testid="main">Main Component</div>);
jest.mock("../UserRegistration", () => () => (
  <div data-testid="registration">User Registration Component</div>
));
jest.mock("../UserLogin", () => () => (
  <div data-testid="login">User Login Component</div>
));

describe("MainRegLog", () => {
  test("renders without crashing", () => {
    const { container } = render(<MainRegLog />);
    expect(container).toBeTruthy();
  });

  test("renders Main component in the left column", () => {
    render(<MainRegLog />);
    expect(screen.getByTestId("main")).toBeInTheDocument();
  });

  test("renders UserRegistration and UserLogin components in the right column", () => {
    render(<MainRegLog />);

    expect(screen.getByTestId("registration")).toBeInTheDocument();
    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  test("renders the correct instructional text", () => {
    render(<MainRegLog />);

    expect(
      screen.getByText(/New user\? Please register:/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Existing user\? Please login:/i),
    ).toBeInTheDocument();
  });
});
