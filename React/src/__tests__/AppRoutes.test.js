import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AppRoutes from "../AppRoutes";

jest.mock("../MainRegLog", () => () => (
  <div data-testid="main-reg-log">MainRegLog</div>
));
jest.mock("../RegisteredPage", () => () => (
  <div data-testid="registered-page">RegisteredPage</div>
));
jest.mock("../UserDashboard", () => () => (
  <div data-testid="user-dashboard">UserDashboard</div>
));
jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">LogoutComponent</div>
));
jest.mock("../PresentationView", () => () => (
  <div data-testid="presentation-view">PresentationView</div>
));
jest.mock("../VerifyEmail", () => () => (
  <div data-testid="verify-email">VerifyEmail</div>
));
jest.mock("../PasswordReset", () => () => (
  <div data-testid="password-reset">PasswordReset</div>
));

describe("AppRoutes", () => {
  const renderAtRoute = (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>,
    );
  };

  test("renders MainRegLog on /", () => {
    renderAtRoute("/");
    expect(screen.getByTestId("main-reg-log")).toBeInTheDocument();
  });

  test("renders RegisteredPage on /RegisteredPage", () => {
    renderAtRoute("/RegisteredPage");
    expect(screen.getByTestId("registered-page")).toBeInTheDocument();
  });

  test("renders UserDashboard on /UserDashboard", () => {
    renderAtRoute("/UserDashboard");
    expect(screen.getByTestId("user-dashboard")).toBeInTheDocument();
  });

  test("renders LogoutComponent on /LogoutComponent", () => {
    renderAtRoute("/LogoutComponent");
    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("renders PresentationView on /PresentationView/:id", () => {
    renderAtRoute("/PresentationView/123");
    expect(screen.getByTestId("presentation-view")).toBeInTheDocument();
  });

  test("renders VerifyEmail on /VerifyEmail", () => {
    renderAtRoute("/VerifyEmail");
    expect(screen.getByTestId("verify-email")).toBeInTheDocument();
  });

  test("renders PasswordReset on /PasswordReset", () => {
    renderAtRoute("/PasswordReset");
    expect(screen.getByTestId("password-reset")).toBeInTheDocument();
  });
});
