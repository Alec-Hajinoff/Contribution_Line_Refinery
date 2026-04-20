import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectedTally from "../SelectedTally";

describe("SelectedTally", () => {
  test("renders the correct count", () => {
    render(
      <SelectedTally count={3} onDisplay={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByText("3 selected")).toBeInTheDocument();
  });

  test("calls onDisplay when 'Display presentation view' is clicked", () => {
    const mockDisplay = jest.fn();

    render(
      <SelectedTally count={1} onDisplay={mockDisplay} onCancel={jest.fn()} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Display presentation view/i }),
    );

    expect(mockDisplay).toHaveBeenCalledTimes(1);
  });

  test("calls onCancel when 'Cancel' is clicked", () => {
    const mockCancel = jest.fn();

    render(
      <SelectedTally count={1} onDisplay={jest.fn()} onCancel={mockCancel} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
