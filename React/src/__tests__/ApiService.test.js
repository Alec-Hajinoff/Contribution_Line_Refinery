import {
  registerUser,
  loginUser,
  logoutUser,
  addContribution,
  contributionsTimeline,
  presentationViewPost,
  presentationViewGet,
  verifyEmail,
  passwordResetLink,
  passwordResetToken,
  updatePassword,
  deleteContribution,
  updateContribution,
} from "../ApiService";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockReset();
});

describe("ApiService", () => {
  test("registerUser sends correct request and returns JSON", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const formData = { email: "test@example.com", password: "123" };
    const result = await registerUser(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/form_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("loginUser sends correct request and returns JSON", async () => {
    const mockResponse = { loggedIn: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const formData = { email: "test@example.com", password: "123" };
    const result = await loginUser(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/login_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("logoutUser sends POST request and succeeds on ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    await logoutUser();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      },
    );
  });

  test("logoutUser throws error on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(logoutUser()).rejects.toThrow(
      "An error occurred during logout.",
    );
  });

  test("addContribution sends FormData and returns JSON", async () => {
    const mockResponse = { id: 123 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const formData = new FormData();
    formData.append("title", "Test");
    const result = await addContribution(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/add_contribution.php",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("addContribution throws error on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const formData = new FormData();
    await expect(addContribution(formData)).rejects.toThrow(
      "An error occurred while adding the contribution.",
    );
  });

  test("contributionsTimeline sends GET request and returns JSON", async () => {
    const mockResponse = [{ id: 1 }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await contributionsTimeline();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/contributions_timeline.php",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("deleteContribution sends correct request and returns JSON", async () => {
    const mockResponse = { status: "success" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await deleteContribution(123);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/delete_contribution.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contribution_id: 123 }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("updateContribution sends FormData and returns JSON", async () => {
    const mockResponse = { status: "success" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const formData = new FormData();
    const result = await updateContribution(formData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/update_contribution.php",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("presentationViewPost sends POST request with JSON body", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const ids = [1, 2, 3];
    const result = await presentationViewPost(ids);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/presentation_view_post.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contributions_id: ids }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("presentationViewGet sends GET request and returns JSON", async () => {
    const mockResponse = { id: 1 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await presentationViewGet(5);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/presentation_view_get.php?id=5",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("verifyEmail sends token and returns JSON", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await verifyEmail("token123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/verify_email.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: "token123" }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("passwordResetLink sends email and returns JSON", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await passwordResetLink("test@example.com");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/password_reset_link.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: "test@example.com" }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("passwordResetToken sends token and returns JSON", async () => {
    const mockResponse = { valid: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await passwordResetToken("token123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/password_reset_token.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: "token123" }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  test("updatePassword sends token and password and returns JSON", async () => {
    const mockResponse = { success: true };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updatePassword("token123", "newPass");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Contribution_Line/update_password.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: "token123", password: "newPass" }),
      },
    );
    expect(result).toEqual(mockResponse);
  });
});
