import React from "react";
import { act, waitFor } from "@testing-library/react";

jest.mock("../App", () => () => (
  <div data-testid="mock-app-entry">App Root Mounted</div>
));
jest.mock("../reportWebVitals", () => jest.fn());

jest.useFakeTimers();

describe("Application Root Entry Sequence (index.js)", () => {
  let rootContainer;

  beforeEach(() => {
    jest.clearAllMocks();

    rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", "root");
    document.body.appendChild(rootContainer);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();

    if (rootContainer && rootContainer.parentNode) {
      document.body.removeChild(rootContainer);
    }

    jest.resetModules();
  });

  test("initializes the application by mounting the App component to the root DOM container", async () => {
    act(() => {
      require("../index.js");
    });

    jest.runAllTimers();

    await waitFor(() => {
      const appElement = rootContainer.querySelector(
        '[data-testid="mock-app-entry"]',
      );
      expect(appElement).toBeInTheDocument();
      expect(appElement).toHaveTextContent("App Root Mounted");
    });
  });

  test("triggers the application performance monitoring subroutines on initial startup execution", async () => {
    const mockReportWebVitals = require("../reportWebVitals");

    act(() => {
      require("../index.js");
    });
    jest.runAllTimers();

    await waitFor(() => {
      expect(mockReportWebVitals).toHaveBeenCalledTimes(1);
    });
  });
});
