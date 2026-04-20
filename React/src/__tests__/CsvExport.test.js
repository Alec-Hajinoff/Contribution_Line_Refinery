import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CsvExport from "../CsvExport";

global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = jest.fn();

const originalBlob = global.Blob;
global.Blob = jest.fn((content, options) => ({ content, options }));

describe("CsvExport", () => {
  const mockContributions = [
    {
      title: "Fixed a bug",
      contribution_date: "2024-01-01",
      created_at: "2024-01-02T10:00:00Z",
      what_happened: "Found a logic error",
      why_it_mattered: "System was crashing",
      outcome_impact: "Stability increased",
      current_role: "Senior Dev",
      current_company: "Tech Corp",
    },
  ];

  beforeAll(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.Blob = originalBlob;
  });

  test("renders the export button", () => {
    render(<CsvExport contributions={[]} />);
    expect(
      screen.getByRole("button", { name: /Export as CSV/i }),
    ).toBeInTheDocument();
  });

  test("alerts when there are no contributions to export", () => {
    render(<CsvExport contributions={[]} />);
    fireEvent.click(screen.getByRole("button", { name: /Export as CSV/i }));
    expect(window.alert).toHaveBeenCalledWith("No contributions to export.");
  });

  test("triggers CSV download when contributions exist", () => {
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const appendSpy = jest.spyOn(document.body, "appendChild");
    const removeSpy = jest.spyOn(document.body, "removeChild");
    const createSpy = jest.spyOn(document, "createElement");

    render(<CsvExport contributions={mockContributions} />);

    fireEvent.click(screen.getByRole("button", { name: /Export as CSV/i }));

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    const anchorCall = createSpy.mock.calls.find((call) => call[0] === "a");
    expect(anchorCall).toBeDefined();

    expect(clickSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(removeSpy).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

    clickSpy.mockRestore();
  });

  test("escapes CSV fields correctly", () => {
    const complexContributions = [
      {
        title: 'Title with "quotes"',
        what_happened: "Field with, comma",
        why_it_mattered: "Field with\nnewline",
      },
    ];

    render(<CsvExport contributions={complexContributions} />);

    fireEvent.click(screen.getByRole("button", { name: /Export as CSV/i }));

    const blobContentArray = global.Blob.mock.calls[0][0];
    const blobContent = blobContentArray[0];

    expect(blobContent).toContain('"Title with ""quotes"""');
    expect(blobContent).toContain('"Field with, comma"');
    expect(blobContent).toContain('"Field with\nnewline"');
  });
});
