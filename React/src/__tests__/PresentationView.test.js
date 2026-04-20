import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import PresentationView from "../PresentationView";
import { presentationViewGet } from "../ApiService";

jest.mock("../ApiService", () => ({
  presentationViewGet: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

window.print = jest.fn();

describe("PresentationView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state initially", async () => {
    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      contributions: [],
    });

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading presentation/i)).toBeInTheDocument();

    await waitFor(() => expect(presentationViewGet).toHaveBeenCalled());
  });

  test("shows error message when API fails", async () => {
    presentationViewGet.mockRejectedValueOnce(new Error("Server error"));

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });
  });

  test("renders presentation header and contributions", async () => {
    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      name: "Alec",
      contributions: [
        {
          id: 1,
          title: "Contribution A",
          contribution_date: "2024-01-01",
          created_at: "2024-02-01",
          categories: ["Leadership"],
          what_happened: "Something happened",
          why_it_mattered: "It mattered",
          outcome_impact: "Big impact",
          evidence_links: [],
          files: [],
        },
      ],
    });

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Professional Contribution Summary - Alec/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Contribution A")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
    expect(screen.getByText("It mattered")).toBeInTheDocument();
    expect(screen.getByText("Big impact")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });

  test("renders evidence links", async () => {
    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      contributions: [
        {
          id: 1,
          title: "Contribution with link",
          contribution_date: "2024-01-01",
          created_at: "2024-02-01",
          categories: [],
          what_happened: "",
          why_it_mattered: "",
          outcome_impact: "",
          evidence_links: [
            { url: "https://example.com/doc1" },
            { url: "https://example.com/doc2" },
          ],
          files: [],
        },
      ],
    });

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("https://example.com/doc1")).toBeInTheDocument();
    });

    expect(screen.getByText("https://example.com/doc2")).toBeInTheDocument();
  });

  test("clicking supporting file triggers downloadFile", async () => {
    const mockFile = {
      file_name: "evidence.pdf",
      file_data: btoa("dummy content"),
      mime_type: "application/pdf",
    };

    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      contributions: [
        {
          id: 1,
          title: "Contribution with file",
          contribution_date: "2024-01-01",
          created_at: "2024-02-01",
          categories: [],
          what_happened: "",
          why_it_mattered: "",
          outcome_impact: "",
          evidence_links: [],
          files: [mockFile],
        },
      ],
    });

    const createObjectURL = jest.fn(() => "blob:mock-url");
    const revokeObjectURL = jest.fn();

    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Contribution with file")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("evidence.pdf"));

    expect(createObjectURL).toHaveBeenCalled();

    await waitFor(() => {
      expect(revokeObjectURL).toHaveBeenCalled();
    });
  });

  test("renders current role and company", async () => {
    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      contributions: [
        {
          id: 1,
          title: "Contribution with role/company",
          contribution_date: "2024-01-01",
          created_at: "2024-02-01",
          categories: [],
          what_happened: "",
          why_it_mattered: "",
          outcome_impact: "",
          evidence_links: [],
          files: [],
          current_role: "Senior Developer",
          current_company: "HSBC Bank",
        },
      ],
    });

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Contribution with role/company"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Current role:/i)).toBeInTheDocument();
    expect(screen.getByText("Senior Developer")).toBeInTheDocument();

    expect(screen.getByText(/Current company:/i)).toBeInTheDocument();
    expect(screen.getByText("HSBC Bank")).toBeInTheDocument();
  });

  test("clicking print button triggers window.print()", async () => {
    presentationViewGet.mockResolvedValueOnce({
      status: "success",
      contributions: [],
    });

    render(
      <MemoryRouter>
        <PresentationView />
      </MemoryRouter>,
    );

    await waitFor(() => expect(presentationViewGet).toHaveBeenCalled());

    fireEvent.click(
      screen.getByRole("button", {
        name: /Print/i,
      }),
    );

    expect(window.print).toHaveBeenCalled();
  });
});
