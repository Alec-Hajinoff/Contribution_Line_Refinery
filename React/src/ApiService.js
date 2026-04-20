//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/form_capture.php",
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
      "http://localhost:8001/Contribution_Line/login_capture.php",
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
      "http://localhost:8001/Contribution_Line/logout_component.php",
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

// addContribution() sends the contribution data to the database.

export const addContribution = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/add_contribution.php",
      {
        method: "POST",

        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("addContribution error:", error);
    throw new Error("An error occurred while adding the contribution.");
  }
};

// contributionsTimeline() fetches all contributions for the logged-in user to display on the timeline.

export const contributionsTimeline = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/contributions_timeline.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("contributionsTimeline error:", error);
    throw new Error("An error occurred while fetching the timeline.");
  }
};

// presentationViewPost() sends the presentation view to the database creating a new presentation view record.

export const presentationViewPost = async (contributionIds) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/presentation_view_post.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ contributions_id: contributionIds }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("presentationViewPost error:", error);
    throw new Error("An error occurred while creating the presentation view.");
  }
};

// presentationViewGet() fetches selected contributions to present them in the presentation view.

export const presentationViewGet = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8001/Contribution_Line/presentation_view_get.php?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("presentationViewGet error:", error);
    throw new Error("An error occurred while fetching the presentation view.");
  }
};

// verifyEmail() checks the token in the email against database and redirects to sign in.

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/verify_email.php",
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
      "http://localhost:8001/Contribution_Line/password_reset_link.php",
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
      "http://localhost:8001/Contribution_Line/password_reset_token.php",
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
      "http://localhost:8001/Contribution_Line/update_password.php",
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

// deleteContribution() deletes an existing contribution and all its associated data.

export const deleteContribution = async (contributionId) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/delete_contribution.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ contribution_id: contributionId }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("deleteContribution error:", error);
    return {
      status: "error",
      message:
        error.message || "An error occurred while deleting the contribution.",
    };
  }
};

// updateContribution() updates an existing contribution and saves the updated version.

export const updateContribution = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/Contribution_Line/update_contribution.php",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updateContribution error:", error);
    return {
      status: "error",
      message:
        error.message || "An error occurred while updating the contribution.",
    };
  }
};
