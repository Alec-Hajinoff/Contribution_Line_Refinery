//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/form_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/login_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};

// verifyEmail() checks the token in the email against database and redirects to sign in.

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/verify_email.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error("An error occurred during email verification.");
  }
};

// passwordResetLink() sends a user's email address to the backend to send a password rest email.

export const passwordResetLink = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/password_reset_link.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetLink error:", error);

    return { success: true };
  }
};

// passwordResetToken() verifies if a password reset token is valid and not expired.

export const passwordResetToken = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/password_reset_token.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetToken error:", error);
    return {
      valid: false,
      message: "An error occurred while verifying the token.",
    };
  }
};

// updatePassword() updates the user's password and clears the reset token.

export const updatePassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/update_password.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      success: false,
      message: "An error occurred while updating the password.",
    };
  }
};

// checkSession() makes the backend call to check if a session exists.

export const checkSession = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/check_session.php",
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
    return { authenticated: false };
  }
};

// projectSubmission() allows a client to submit their project.

export const projectSubmission = async (formData) => {
  try {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    formData.attachments.forEach((file, index) => {
      data.append("attachments[]", file);
    });

    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/project_submission.php",
      {
        method: "POST",
        credentials: "include",
        body: data,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Project submission error:", error);
    throw new Error(
      error.message || "An error occurred during project submission.",
    );
  }
};

// getProjects() fetches a client's existing projects for display in user dashboard.

export const getProjects = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/get_projects.php",
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get projects error:", error);
    throw new Error(
      error.message || "An error occurred while fetching projects.",
    );
  }
};

// projectMessages() allows a client to submit messages and attachments for a specific project.

export const projectMessages = async (projectId, formData) => {
  try {
    const data = new FormData();
    data.append("project_id", projectId);
    data.append("message", formData.message);

    formData.attachments.forEach((file, index) => {
      data.append("attachments[]", file);
    });

    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/project_messages.php",
      {
        method: "POST",
        credentials: "include",
        body: data,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Project message submission error:", error);
    throw new Error(
      error.message || "An error occurred during message submission.",
    );
  }
};

// projectTimeline() fetches all messages and attachments for a specific project and displays them as a timeline.

export const projectTimeline = async (projectId) => {
  try {
    const response = await fetch(
      `http://localhost:8001/Hertford_Standard/project_timeline.php?project_id=${projectId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get project timeline error:", error);
    throw new Error(
      error.message || "An error occurred while fetching project messages.",
    );
  }
};

// statusUpdate() allows admin to update a project's status.

export const statusUpdate = async (projectId, status) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/status_update.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          project_id: projectId,
          status: status,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Status update error:", error);
    throw new Error(
      error.message || "An error occurred while updating status.",
    );
  }
};

// getUsers() fetches all user names for the admin dropdown selection.

export const getUsers = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Hertford_Standard/get_users.php",
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get users error:", error);
    throw new Error(error.message || "An error occurred while fetching users.");
  }
};
