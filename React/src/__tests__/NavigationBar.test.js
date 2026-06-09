import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import NavigationBar from "../NavigationBar";

const renderWithRouter = (ui, initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
};

describe("NavigationBar Component Conditional Layout Tests", () => {
  test("renders public base links ('About me' and 'Portfolio') across all routes", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={false}
        isLoading={false}
        userRole={null}
      />,
      ["/"],
    );

    const aboutMeLink = screen.getByRole("link", { name: /about me/i });
    const portfolioLink = screen.getByRole("link", { name: /portfolio/i });

    expect(aboutMeLink).toBeInTheDocument();
    expect(aboutMeLink).toHaveAttribute("href", "/Aboutme");
    expect(portfolioLink).toBeInTheDocument();
    expect(portfolioLink).toHaveAttribute("href", "/Portfolio");
  });

  test("hides the 'Home' navigation link if the active browser path is the root homepage", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={false}
        isLoading={false}
        userRole={null}
      />,
      ["/"],
    );

    expect(
      screen.queryByRole("link", { name: /^home$/i }),
    ).not.toBeInTheDocument();
  });

  test("renders the 'Home' navigation link if the active browser path is an internal subpage", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={false}
        isLoading={false}
        userRole={null}
      />,
      ["/Aboutme"],
    );

    const homeLink = screen.getByRole("link", { name: /^home$/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("renders user-tier dashboard link redirecting to '/UserDashboard' for non-admin accounts", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={true}
        isLoading={false}
        userRole="client"
      />,
      ["/Aboutme"],
    );

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/UserDashboard");
  });

  test("renders admin-tier dashboard link redirecting to '/AdminDashboard' for admin roles", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={true}
        isLoading={false}
        userRole="admin"
      />,
      ["/Aboutme"],
    );

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/AdminDashboard");
  });

  test("hides the 'Dashboard' choice block completely while authentication states are loading", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={true}
        isLoading={true}
        userRole="admin"
      />,
      ["/Aboutme"],
    );

    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });

  test("hides the 'Dashboard' choice block completely if the user profile is unauthenticated", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={false}
        isLoading={false}
        userRole="admin"
      />,
      ["/Aboutme"],
    );

    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });

  test("hides the 'Dashboard' link button when currently active inside the User Dashboard panel path", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={true}
        isLoading={false}
        userRole="client"
      />,
      ["/UserDashboard"],
    );

    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });

  test("hides the 'Dashboard' link button when currently active inside the Admin Dashboard panel path", () => {
    renderWithRouter(
      <NavigationBar
        isAuthenticated={true}
        isLoading={false}
        userRole="admin"
      />,
      ["/AdminDashboard"],
    );

    expect(
      screen.queryByRole("link", { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });
});
