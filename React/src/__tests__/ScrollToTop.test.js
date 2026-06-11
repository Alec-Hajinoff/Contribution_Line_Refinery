import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ScrollToTop from "../ScrollToTop";

if (typeof window !== "undefined") {
  if (!window.getSelection) {
    const mockSelection = () => ({
      removeAllRanges: () => {},
      addRange: () => {},
      getRangeAt: () => ({
        setStart: () => {},
        setEnd: () => {},
        cloneRange: () => ({
          collapse: () => {},
        }),
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
      commonAncestorContainer: {
        nodeName: "#document",
        type: "ELEMENT_NODE",
      },
    });
  }
}

describe("ScrollToTop Component Navigation Lifecycle Tests", () => {
  const mockScrollTo = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, "scrollTo", {
      value: mockScrollTo,
      writable: true,
    });
  });

  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  test("Initial State: returns null to the DOM layout but fires window.scrollTo on initial component mounting", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("Lifecycle Branch: detects route alterations and re-fires window.scrollTo to update viewport position", async () => {
    const user = userEvent.setup();

    const TestComponentApp = () => (
      <MemoryRouter initialEntries={["/home"]}>
        <ScrollToTop />
        <nav>
          <Link to="/about">Go to About Page</Link>
          <Link to="/home">Stay on Home Page</Link>
        </nav>
        <Routes>
          <Route path="/home" element={<div>Home Screen View</div>} />
          <Route path="/about" element={<div>About Screen View</div>} />
        </Routes>
      </MemoryRouter>
    );

    render(<TestComponentApp />);

    mockScrollTo.mockClear();

    const aboutLink = document.querySelector('a[href="/about"]');
    await user.click(aboutLink);

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("Optimization Branch: ignores viewport overrides if the route destination pathname doesn't change", async () => {
    const user = userEvent.setup();

    const TestComponentApp = () => (
      <MemoryRouter initialEntries={["/home"]}>
        <ScrollToTop />
        <nav>
          <Link to="/home">Trigger Identical Path Link</Link>
        </nav>
        <Routes>
          <Route path="/home" element={<div>Home Screen View</div>} />
        </Routes>
      </MemoryRouter>
    );

    render(<TestComponentApp />);

    mockScrollTo.mockClear();

    const sameLink = document.querySelector('a[href="/home"]');
    await user.click(sameLink);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
