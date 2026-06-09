import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainRegLog from "../MainRegLog";

jest.mock("../Main.js", () => () => (
  <div data-testid="mock-main">Main Component Content</div>
));
jest.mock("../TechnologyStack.js", () => () => (
  <div data-testid="mock-tech-stack">Tech Stack Content</div>
));
jest.mock("../UserRegistration.js", () => () => (
  <div data-testid="mock-registration">Registration Form</div>
));
jest.mock("../UserLogin.js", () => () => (
  <div data-testid="mock-login">Login Form</div>
));

describe("MainRegLog Layout and Outside-Interaction Integration Tests", () => {
  test("renders the core structure layout grid and links sub-components correctly", () => {
    render(<MainRegLog />);

    expect(screen.getByTestId("mock-main")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tech-stack")).toBeInTheDocument();
    expect(screen.getByTestId("mock-registration")).toBeInTheDocument();
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();

    expect(
      screen.getByText(/New client\? Please register:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Existing client\? Please login:/i),
    ).toBeInTheDocument();
  });

  test("toggles help information tooltip visibility upon user click triggers", () => {
    render(<MainRegLog />);

    const tooltipTextPattern =
      /Registered clients can submit requirements with text and files/i;
    expect(screen.queryByText(tooltipTextPattern)).not.toBeInTheDocument();

    const helpButton = screen.getByRole("button", {
      name: /help information/i,
    });
    fireEvent.click(helpButton);

    expect(screen.getByText(tooltipTextPattern)).toBeInTheDocument();

    fireEvent.click(helpButton);

    expect(screen.queryByText(tooltipTextPattern)).not.toBeInTheDocument();
  });

  test("closes help tooltip window automatically when an outside click event fires", () => {
    render(<MainRegLog />);
    const helpButton = screen.getByRole("button", {
      name: /help information/i,
    });
    fireEvent.click(helpButton);

    const tooltipTextPattern =
      /Registered clients can submit requirements with text and files/i;
    expect(screen.getByText(tooltipTextPattern)).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText(tooltipTextPattern)).not.toBeInTheDocument();
  });

  test("closes help tooltip window automatically when an outside touchstart event fires", () => {
    render(<MainRegLog />);
    const helpButton = screen.getByRole("button", {
      name: /help information/i,
    });
    fireEvent.click(helpButton);

    const tooltipTextPattern =
      /Registered clients can submit requirements with text and files/i;
    expect(screen.getByText(tooltipTextPattern)).toBeInTheDocument();

    fireEvent.touchStart(document.body);

    expect(screen.queryByText(tooltipTextPattern)).not.toBeInTheDocument();
  });

  test("preserves tooltip open visibility if the user clicks directly inside the tooltip boundaries", () => {
    render(<MainRegLog />);
    const helpButton = screen.getByRole("button", {
      name: /help information/i,
    });
    fireEvent.click(helpButton);

    const tooltipContent = screen.getByText(
      /Registered clients can submit requirements with text and files/i,
    );
    expect(tooltipContent).toBeInTheDocument();

    fireEvent.mouseDown(tooltipContent);

    expect(tooltipContent).toBeInTheDocument();
  });
});
