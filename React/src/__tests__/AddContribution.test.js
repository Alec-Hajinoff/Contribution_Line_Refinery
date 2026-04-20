import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import AddContribution from "../AddContribution";
import { addContribution } from "../ApiService";

jest.mock("../ApiService", () => ({
  addContribution: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/Contribution title/i), {
    target: { value: "My Contribution" },
  });

  fireEvent.change(screen.getByLabelText(/What happened/i), {
    target: { value: "Something happened" },
  });

  fireEvent.change(screen.getByLabelText(/Why it mattered/i), {
    target: { value: "It mattered" },
  });

  fireEvent.change(screen.getByLabelText(/Outcome \/ impact/i), {
    target: { value: "Big impact" },
  });

  fireEvent.change(screen.getByLabelText(/Contribution date/i), {
    target: { value: "2024-01-01" },
  });

  fireEvent.change(screen.getByLabelText(/Current role/i), {
    target: { value: "Senior Developer" },
  });

  fireEvent.change(screen.getByLabelText(/Current company/i), {
    target: { value: "HSBC Bank" },
  });
}

describe("AddContribution", () => {
  test("renders all required fields", () => {
    render(<AddContribution />);

    expect(screen.getByText(/Add a contribution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contribution title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/What happened/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Why it mattered/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Outcome \/ impact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contribution date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current company/i)).toBeInTheDocument();
  });

  test("requires at least one category", async () => {
    render(<AddContribution />);

    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please select at least one category.",
      );
    });
  });

  test("requires current role", async () => {
    render(<AddContribution />);

    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/Current role/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByLabelText(/Leadership \/ Ownership/i));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter your current role.",
      );
    });
  });

  test("requires current company", async () => {
    render(<AddContribution />);

    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/Current company/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByLabelText(/Leadership \/ Ownership/i));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter your current company.",
      );
    });
  });

  test("rejects files over 10MB", async () => {
    render(<AddContribution />);

    const fileInput = screen.getByLabelText(/Supporting file/i);

    const bigFile = new File(["x".repeat(11 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [bigFile] } });

    expect(window.alert).toHaveBeenCalledWith("File size exceeds 10MB limit.");
    expect(fileInput.value).toBe("");
  });

  test("rejects invalid file types", async () => {
    render(<AddContribution />);

    const fileInput = screen.getByLabelText(/Supporting file/i);

    const badFile = new File(["hello"], "file.exe", {
      type: "application/x-msdownload",
    });

    fireEvent.change(fileInput, { target: { files: [badFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Only PDF, JPG, and PNG files are allowed.",
    );
    expect(fileInput.value).toBe("");
  });

  test("submits form successfully and resets fields", async () => {
    addContribution.mockResolvedValueOnce({});

    const onContributionAdded = jest.fn();

    render(<AddContribution onContributionAdded={onContributionAdded} />);

    fillRequiredFields();

    fireEvent.click(screen.getByLabelText(/Leadership \/ Ownership/i));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/Saving/i)).toBeInTheDocument();

    expect(await screen.findByText(/Saved successfully./i)).toBeInTheDocument();

    expect(onContributionAdded).toHaveBeenCalled();

    expect(screen.getByLabelText(/Contribution title/i).value).toBe("");
    expect(screen.getByLabelText(/Current role/i).value).toBe("");
    expect(screen.getByLabelText(/Current company/i).value).toBe("");

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Saved successfully/i),
        ).not.toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });

  test("handles API error", async () => {
    addContribution.mockRejectedValueOnce(new Error("Server error"));

    render(<AddContribution />);

    fillRequiredFields();
    fireEvent.click(screen.getByLabelText(/Leadership \/ Ownership/i));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(addContribution).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Error saving\./i)).toBeInTheDocument();
    });
  });

  test("sends correct FormData payload", async () => {
    addContribution.mockResolvedValueOnce({});

    render(<AddContribution />);

    fillRequiredFields();

    fireEvent.click(screen.getByLabelText(/Leadership \/ Ownership/i));

    fireEvent.change(screen.getByLabelText(/Evidence link/i), {
      target: { value: "https://example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(addContribution).toHaveBeenCalled());

    const formDataArg = addContribution.mock.calls[0][0];
    expect(formDataArg instanceof FormData).toBe(true);

    expect(formDataArg.get("title")).toBe("My Contribution");
    expect(formDataArg.get("what_happened")).toBe("Something happened");
    expect(formDataArg.get("why_it_mattered")).toBe("It mattered");
    expect(formDataArg.get("outcome_impact")).toBe("Big impact");
    expect(formDataArg.get("contribution_date")).toBe("2024-01-01");
    expect(formDataArg.get("current_role")).toBe("Senior Developer");
    expect(formDataArg.get("current_company")).toBe("HSBC Bank");
    expect(formDataArg.get("evidence_link")).toBe("https://example.com");

    const categories = formDataArg.getAll("categories[]");
    expect(categories).toEqual(["Leadership / Ownership"]);
  });
});
