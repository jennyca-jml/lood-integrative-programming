// signup.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Remove previous errors
    document.querySelectorAll(".error-message").forEach((msg) => msg.remove());

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
      });
      localStorage.setItem("users", JSON.stringify(storedUsers));

      alert("Signup successful! Please log in.");
      window.location.href = "login.html"; // redirect to login page
    }
  });

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
});

// login.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Remove previous errors
    document.querySelectorAll(".error-message").forEach((msg) => msg.remove());

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
      (user) => user.email === email.value && user.password === password.value,
    );
    if (!user) {
      showError(email, "Email or password is incorrect.");
      isValid = false;
    }

    // If valid, redirect to profile
    if (isValid && user) {
      localStorage.setItem("profileName", user.name);
      localStorage.setItem("profileEmail", user.email);

      alert("Login successful! Redirecting to your profile...");
      window.location.href = "profile.html";
    }
  });

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
});
