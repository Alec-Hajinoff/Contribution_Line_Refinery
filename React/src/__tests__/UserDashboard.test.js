import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserDashboard from "../UserDashboard";

jest.mock("../ProjectSubmission", () => {
  return function MockProjectSubmission({ onProjectSubmitted }) {
    return (
      <div data-testid="mock-project-submission">
        <button
          data-testid="simulate-submit-trigger"
          onClick={onProjectSubmitted}
        >
          Simulate Submission Dispatch
        </button>
      </div>
    );
  };
});

jest.mock("../GetProjects", () => {
  return function MockGetProjects({ refreshTrigger }) {
    return (
      <div data-testid="mock-get-projects">
        Active Refresh ID:{" "}
        <span data-testid="refresh-count-display">{refreshTrigger}</span>
      </div>
    );
  };
});

if (typeof window !== "undefined") {
  if (!window.getSelection) {
    const mockSelection = () => ({
      removeAllRanges: () => {},
      addRange: () => {},
      getRangeAt: () => ({
        setStart: () => {},
        setEnd: () => {},
        cloneRange: () => ({ collapse: () => {} }),
        collapse: () => {},
      }),
    });
    window.getSelection = mockSelection;
    document.getSelection = mockSelection;
  }

  if (!document.createRange) {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      cloneRange: function () {
        return this;
      },
      collapse: () => {},
      getClientRects: () => [],
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      }),
      commonAncestorContainer: { nodeName: "#document", type: "ELEMENT_NODE" },
    });
  }
}

describe("UserDashboard Component Lifecycle Integration Tests", () => {
  test("The Static Layer: renders layout structures and dashboard introductory instructions", () => {
    render(<UserDashboard />);

    const welcomeMessage = screen.getByText(/Welcome to your dashboard\./i);
    expect(welcomeMessage).toBeInTheDocument();
    expect(welcomeMessage.tagName).toBe("P");
  });

  test("Composition Layer: renders nested component wrappers inside the visual DOM tree", () => {
    render(<UserDashboard />);

    expect(screen.getByTestId("mock-project-submission")).toBeInTheDocument();
    expect(screen.getByTestId("mock-get-projects")).toBeInTheDocument();
  });

  test("The Event Bridge: passes initial states and increments dependency counter properties on submission loops", () => {
    render(<UserDashboard />);

    const counterDisplay = screen.getByTestId("refresh-count-display");
    const simulatedActionBtn = screen.getByTestId("simulate-submit-trigger");

    expect(counterDisplay).toHaveTextContent("0");

    fireEvent.click(simulatedActionBtn);

    expect(counterDisplay).toHaveTextContent("1");

    fireEvent.click(simulatedActionBtn);

    expect(counterDisplay).toHaveTextContent("2");
  });
});
