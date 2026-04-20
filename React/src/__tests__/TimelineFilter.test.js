import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimelineFilter from "../TimelineFilter";

describe("TimelineFilter", () => {
  test("updates start date via setFilters", () => {
    const mockSetFilters = jest.fn();
    const filters = { startDate: "", endDate: "" };

    render(
      <TimelineFilter
        filters={filters}
        setFilters={mockSetFilters}
        onClear={jest.fn()}
      />,
    );

    const startInput = document.querySelector('input[name="startDate"]');

    fireEvent.change(startInput, { target: { value: "2024-01-01" } });

    expect(mockSetFilters).toHaveBeenCalledTimes(1);
    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  test("updates end date via setFilters", () => {
    const mockSetFilters = jest.fn();
    const filters = { startDate: "", endDate: "" };

    render(
      <TimelineFilter
        filters={filters}
        setFilters={mockSetFilters}
        onClear={jest.fn()}
      />,
    );

    const endInput = document.querySelector('input[name="endDate"]');

    fireEvent.change(endInput, { target: { value: "2024-12-31" } });

    expect(mockSetFilters).toHaveBeenCalledTimes(1);
    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  test("calls onClear when 'Clear all filters' is clicked", () => {
    const mockOnClear = jest.fn();

    render(
      <TimelineFilter
        filters={{ startDate: "", endDate: "" }}
        setFilters={jest.fn()}
        onClear={mockOnClear}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Clear all filters/i }));

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});
