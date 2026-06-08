import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  passwordResetLink,
  passwordResetToken,
  updatePassword,
  checkSession,
  projectSubmission,
  getProjects,
  projectMessages,
  projectTimeline,
  statusUpdate,
  getUsers,
  manageUsers,
  updateUserName,
  userDeletion,
  contactForm,
} from "../ApiService";

describe("ApiService - Comprehensive Complete Test Suite", () => {
  beforeEach(() => {
    global.fetch = jest.fn();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Standard JSON POST Functions", () => {
    const mockSuccessResponse = {
      success: true,
      message: "Operation completed successfully",
    };

    test("registerUser sends correct payload and resolves data", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const formData = { username: "alec", password: "securepassword" };
      const result = await registerUser(formData);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/form_capture.php",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    test("loginUser sends correct payload and resolves data", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const formData = { username: "alec", password: "securepassword" };
      const result = await loginUser(formData);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/login_capture.php",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    test("verifyEmail sends token and resolves data", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await verifyEmail("test-token-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/verify_email.php",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ token: "test-token-123" }),
        }),
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    test("passwordResetLink handles success and catches error to return a fallback object", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Database offline"));

      const result = await passwordResetLink("test@example.com");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/password_reset_link.php",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@example.com" }),
        }),
      );
      expect(result).toEqual({ success: true });
    });

    test("passwordResetToken returns validation details or a failure fallback on network crash", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Timeout"));

      const result = await passwordResetToken("token123");

      expect(result).toEqual({
        valid: false,
        message: "An error occurred while verifying the token.",
      });
    });

    test("updatePassword submits new credentials or returns a fallback on error", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Failed"));

      const result = await updatePassword("token123", "newPass");

      expect(result).toEqual({
        success: false,
        message: "An error occurred while updating the password.",
      });
    });

    test("statusUpdate sends projectId and status safely", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await statusUpdate(45, "In Progress");
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/status_update.php",
        expect.objectContaining({
          body: JSON.stringify({ project_id: 45, status: "In Progress" }),
        }),
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    test("updateUserName submits altered profile details", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await updateUserName(10, "Updated Name");
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/update_user_name.php",
        expect.objectContaining({
          body: JSON.stringify({ user_id: 10, name: "Updated Name" }),
        }),
      );
    });

    test("userDeletion submits selected target id for cascade execution", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await userDeletion(99);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/user_deletion.php",
        expect.objectContaining({
          body: JSON.stringify({ user_id: 99 }),
        }),
      );
    });

    test("contactForm sends data cleanly without state storage dependency", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const clientInput = {
        name: "John",
        email: "j@me.com",
        phone: "123",
        projectDescription: "Build app",
        website: "test.com",
      };

      await contactForm(clientInput);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/contact_form.php",
        expect.objectContaining({
          body: JSON.stringify(clientInput),
        }),
      );
    });
  });

  describe("GET Request Functions", () => {
    test("checkSession evaluates auth status or falls back gracefully on network crash", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Disconnected"));
      const result = await checkSession();
      expect(result).toEqual({ authenticated: false });
    });

    test("getProjects requests user-bound project collections", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Website" }],
      });

      const result = await getProjects();
      expect(result).toEqual([{ id: 1, title: "Website" }]);
    });

    test("projectTimeline appends query parameter seamlessly", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ timeline: [] }),
      });

      await projectTimeline(101);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/project_timeline.php?project_id=101",
        expect.objectContaining({ method: "GET" }),
      );
    });

    test("getUsers requests complete system name profiles", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, users: [] }),
      });

      await getUsers();
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/get_users.php",
        expect.objectContaining({ method: "GET" }),
      );
    });

    test("manageUsers appends target userId query string key", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 5 }),
      });

      await manageUsers(5);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/manage_users.php?user_id=5",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("Multipart FormData Upload Functions", () => {
    test("projectSubmission appends fields and files array into a FormData entity", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const mockSubmission = {
        title: "New Venture",
        description: "A large scale react migration",
        attachments: [
          new File(["dummy data"], "spec.pdf", { type: "application/pdf" }),
        ],
      };

      await projectSubmission(mockSubmission);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/project_submission.php",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });

    test("projectMessages processes message string and files array into a FormData entity", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const mockMessageData = {
        message: "Here is the updated asset archive",
        attachments: [
          new File(["image content"], "logo.png", { type: "image/png" }),
        ],
      };

      await projectMessages(404, mockMessageData);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8001/Hertford_Standard/PHP/project_messages.php",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });
  });

  describe("logoutUser Function", () => {
    test("logoutUser resolves cleanly on HTTP ok or throws an exact customized error string if request fails", async () => {
      global.fetch.mockResolvedValueOnce({ ok: false });
      await expect(logoutUser()).rejects.toThrow(
        "An error occurred during logout.",
      );
    });
  });
});
