// ========== GLOBAL VARIABLES ==========
// Default admin account
const DEFAULT_ADMIN = {
  name: "Admin",
  email: "admin@guitaria.com",
  password: "adminguitaria123",
  role: "admin",
};

// Initialize default admin if not exists - IMPROVED VERSION
(function initializeAdmin() {
  // Get existing users or create new array
  let users = [];

  try {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      // Make sure users is an array
      if (!Array.isArray(users)) {
        users = [];
      }
    }
  } catch (e) {
    console.error("Error parsing users:", e);
    users = [];
  }

  // Check if admin exists
  const adminExists = users.some(
    (user) => user && user.email === "admin@guitaria.com",
  );

  // Add admin if not exists
  if (!adminExists) {
    users.push(DEFAULT_ADMIN);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Admin account created successfully!");
  } else {
    console.log("Admin account already exists");
  }
})();

// Sample users data for manage-users page
const SAMPLE_USERS = [
  { id: 1, name: "Ana", email: "ana@email.com", role: "user" },
  { id: 2, name: "Juan", email: "juan@email.com", role: "user" },
  { id: 3, name: "Maria", email: "maria@email.com", role: "user" },
  { id: 4, name: "Pedro", email: "pedro@email.com", role: "user" },
];

// ========== SIGNUP FUNCTIONALITY ==========
document.addEventListener("DOMContentLoaded", function () {
  // Signup form handler
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Remove previous errors
      document
        .querySelectorAll(".error-message")
        .forEach((msg) => msg.remove());

      let isValid = true;

      // Full Name validation
      if (fullName.value.trim().length < 3) {
        showError(fullName, "Full Name must be at least 3 characters.");
        isValid = false;
      }

      // Email format validation
      if (!validateEmail(email.value)) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
      }

      // Password validation
      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters.");
        isValid = false;
      }

      // Confirm Password validation
      if (password.value !== confirmPassword.value) {
        showError(confirmPassword, "Passwords do not match.");
        isValid = false;
      }

      // Duplicate email check
      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      if (storedUsers.some((user) => user.email === email.value)) {
        showError(email, "This email is already registered.");
        isValid = false;
      }

      // If all validations pass
      if (isValid) {
        storedUsers.push({
          name: fullName.value,
          email: email.value,
          password: password.value,
          role: "user", // Default role for new users
        });
        localStorage.setItem("users", JSON.stringify(storedUsers));

        alert("Signup successful! Please log in.");
        window.location.href = "login.html";
      }
    });
  }

  // ========== LOGIN FUNCTIONALITY ==========
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Remove previous errors
      document
        .querySelectorAll(".error-message")
        .forEach((msg) => msg.remove());

      let isValid = true;

      // Email validation
      if (!validateEmail(email.value)) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
      }

      // Password validation
      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters.");
        isValid = false;
      }

      // Check credentials
      let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = storedUsers.find(
        (user) =>
          user.email === email.value && user.password === password.value,
      );

      if (!user) {
        showError(email, "Email or password is incorrect.");
        isValid = false;
      }

      // If valid, redirect based on role
      if (isValid && user) {
        localStorage.setItem("profileName", user.name);
        localStorage.setItem("profileEmail", user.email);
        localStorage.setItem("userRole", user.role || "user");

        alert("Login successful! Redirecting...");

        // Redirect based on role
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "profile.html";
        }
      }
    });
  }

  // ========== PROFILE PAGE FUNCTIONALITY ==========
  if (document.querySelector(".profile-card")) {
    const nameField = document.querySelector(".profile-card h1");
    const emailField = document.querySelector(".profile-email");

    // Get info from localStorage
    const storedName = localStorage.getItem("profileName");
    const storedEmail = localStorage.getItem("profileEmail");

    // Update the profile page
    if (storedName) nameField.textContent = storedName;
    if (storedEmail) emailField.textContent = storedEmail;
  }

  // ========== LOGOUT FUNCTIONALITY ==========
  const logoutLink = document.querySelector('.nav-links a[href="login.html"]');
  if (logoutLink && logoutLink.textContent.includes("Logout")) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Clear user data but keep users list
      localStorage.removeItem("profileName");
      localStorage.removeItem("profileEmail");
      localStorage.removeItem("userRole");
      window.location.href = "login.html";
    });
  }

  // ========== SETTINGS PAGE FUNCTIONALITY ==========
  const saveBtn = document.querySelector(".save-btn");
  if (saveBtn) {
    const themeSelect = document.getElementById("theme");

    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      themeSelect.value = savedTheme;
      document.body.className = savedTheme + "-theme";
    }

    saveBtn.addEventListener("click", function () {
      // Save theme preference
      const selectedTheme = themeSelect.value;
      localStorage.setItem("theme", selectedTheme);
      document.body.className = selectedTheme + "-theme";

      // Show feedback
      alert("Settings saved!");
    });
  }

// ========== ADMIN DASHBOARD FUNCTIONALITY ==========
// Check admin access - IMMEDIATE EXECUTION
(function checkAdminAccess() {
  // Check if current page is admin page
  const currentPage = window.location.pathname;
  const isAdminPage = currentPage.includes("admin.html") || 
                      currentPage.includes("manage-users.html");
  
  if (isAdminPage) {
    // Get user role
    const userRole = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("profileName"); // Check if logged in
    
    // Debug info (remove in production)
    console.log("Admin access check:", { userRole, isLoggedIn, currentPage });
    
    // Redirect conditions
    if (!isLoggedIn) {
      // Not logged in at all
      alert("Please log in first.");
      window.location.href = "login.html";
      return;
    }
    
    if (userRole !== "admin") {
      // Logged in but not admin
      alert("Access denied. Admin only.");
      window.location.href = "profile.html"; // Send to profile instead of login
      return;
    }
    
    // If we get here, user is admin - allow access
    console.log("Admin access granted");
  }
})();

// ========== HELPER FUNCTIONS ==========
function showError(input, message) {
  const error = document.createElement("div");
  error.className = "error-message";
  error.style.color = "red";
  error.style.fontSize = "0.9em";
  error.textContent = message;
  input.parentNode.insertBefore(error, input.nextSibling);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ========== USER MANAGEMENT FUNCTIONS ==========
function initializeUserManagement() {
  let users = [...SAMPLE_USERS];

  // Render users table
  renderUsersTable(users);

  // Add user form handler
  const addUserForm = document.getElementById("addUserForm");
  if (addUserForm) {
    addUserForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("newName").value;
      const email = document.getElementById("newEmail").value;
      const role = document.getElementById("newRole").value;

      // Create new user
      const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        role: role,
      };

      users.push(newUser);
      renderUsersTable(users);

      // Clear form
      addUserForm.reset();

      alert("User added successfully!");
    });
  }
}

function renderUsersTable(users) {
  const tableBody = document.getElementById("usersTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="deleteUser(${user.id})" class="delete-btn">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Global function for delete button
function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    // In a real app, you'd remove from array/database
    alert(`User ${userId} deleted (simulated)`);
    // For demo, we'll just show alert since data is static
  }
}

// Password visibility toggle
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", function () {
    // Toggle the type attribute
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Toggle the eye icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
}
