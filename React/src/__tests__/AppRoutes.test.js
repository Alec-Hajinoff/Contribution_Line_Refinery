import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import AppRoutes from "../AppRoutes";

jest.mock("../MainRegLog", () => () => (
  <div data-testid="page-home">Home Authentication Page</div>
));
jest.mock("../AboutMe", () => () => (
  <div data-testid="page-aboutme">About Me Page</div>
));
jest.mock("../Portfolio", () => () => (
  <div data-testid="page-portfolio">Portfolio Page</div>
));
jest.mock("../PrivacyPolicy", () => () => (
  <div data-testid="page-privacy">Privacy Policy Page</div>
));
jest.mock("../TermsOfService", () => () => (
  <div data-testid="page-terms">Terms Page</div>
));
jest.mock("../RegisteredPage", () => () => (
  <div data-testid="page-registered">Registered Confirmation Page</div>
));
jest.mock("../LogoutComponent", () => () => (
  <div data-testid="page-logout">Logout Component</div>
));
jest.mock("../VerifyEmail", () => () => (
  <div data-testid="page-verify">Verify Email Page</div>
));
jest.mock("../PasswordReset", () => () => (
  <div data-testid="page-reset">Password Reset Page</div>
));
jest.mock("../UserDashboard", () => () => (
  <div data-testid="page-user-dash">User Dashboard Page</div>
));
jest.mock("../AdminDashboard", () => () => (
  <div data-testid="page-admin-dash">Admin Dashboard Page</div>
));

jest.mock("../ProtectedRoute", () => ({ children }) => <>{children}</>);

describe("AppRoutes Component Navigation Routing Tests", () => {
  test("renders the Main Registration & Login layout view at the root path '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-home")).toBeInTheDocument();
    expect(screen.queryByTestId("page-aboutme")).not.toBeInTheDocument();
  });

  test("renders the AboutMe component view at path '/Aboutme'", () => {
    render(
      <MemoryRouter initialEntries={["/Aboutme"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-aboutme")).toBeInTheDocument();
  });

  test("renders the Portfolio component view at path '/Portfolio'", () => {
    render(
      <MemoryRouter initialEntries={["/Portfolio"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-portfolio")).toBeInTheDocument();
  });

  test("renders the PrivacyPolicy layout view at path '/Privacypolicy'", () => {
    render(
      <MemoryRouter initialEntries={["/Privacypolicy"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-privacy")).toBeInTheDocument();
  });

  test("renders the TermsOfService layout view at path '/Termsofservice'", () => {
    render(
      <MemoryRouter initialEntries={["/Termsofservice"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-terms")).toBeInTheDocument();
  });

  test("renders user and system confirmation endpoints successfully", () => {
    render(
      <MemoryRouter initialEntries={["/RegisteredPage"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-registered")).toBeInTheDocument();
  });

  test("renders LogoutComponent at path '/LogoutComponent'", () => {
    render(
      <MemoryRouter initialEntries={["/LogoutComponent"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-logout")).toBeInTheDocument();
  });

  test("renders VerifyEmail at path '/VerifyEmail'", () => {
    render(
      <MemoryRouter initialEntries={["/VerifyEmail"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-verify")).toBeInTheDocument();
  });

  test("renders PasswordReset at path '/PasswordReset'", () => {
    render(
      <MemoryRouter initialEntries={["/PasswordReset"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-reset")).toBeInTheDocument();
  });

  test("renders UserDashboard at path '/UserDashboard'", () => {
    render(
      <MemoryRouter initialEntries={["/UserDashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-user-dash")).toBeInTheDocument();
  });

  test("renders AdminDashboard at path '/AdminDashboard'", () => {
    render(
      <MemoryRouter initialEntries={["/AdminDashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-admin-dash")).toBeInTheDocument();
  });
});
