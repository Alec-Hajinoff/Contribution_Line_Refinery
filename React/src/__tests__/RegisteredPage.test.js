import React from "react";
import { render, screen } from "@testing-library/react";

import RegisteredPage from "../RegisteredPage";

jest.mock("../UserLogin", () => () => (
  <div data-testid="user-login">Mocked UserLogin</div>
));

describe("RegisteredPage", () => {
  test("renders without crashing", () => {
    const { container } = render(<RegisteredPage />);
    expect(container).toBeTruthy();
  });

  test("displays the registration thank-you message", () => {
    render(<RegisteredPage />);

    expect(
      screen.getByText(
        /Please log in using your credentials./i,
      ),
    ).toBeInTheDocument();
  });

  test("renders the login section label", () => {
    render(<RegisteredPage />);

    expect(screen.getByText(/Registered user login:/i)).toBeInTheDocument();
  });

  test("renders the UserLogin component", () => {
    render(<RegisteredPage />);

    expect(screen.getByTestId("user-login")).toBeInTheDocument();
  });
});
