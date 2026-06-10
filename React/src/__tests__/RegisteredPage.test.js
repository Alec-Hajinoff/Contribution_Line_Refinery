import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisteredPage from "../RegisteredPage";

jest.mock("../UserLogin", () => {
  return function MockUserLogin() {
    return <div data-testid="mock-user-login">User Login Entry Panel</div>;
  };
});

describe("RegisteredPage Component Grid Structure and Typography Tests", () => {
  test("Structure & Typography: renders the verified alert copywriting and embeds the isolated login sub-module", () => {
    render(<RegisteredPage />);

    expect(
      screen.getByText(
        /Thank you for verifying your email address! Please log in using your credentials\./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText(/Registered user login:/i)).toBeInTheDocument();

    const nestedLoginModule = screen.getByTestId("mock-user-login");
    expect(nestedLoginModule).toBeInTheDocument();
    expect(nestedLoginModule).toHaveTextContent("User Login Entry Panel");
  });
});
