document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll("#togglePassword")
  togglePasswordButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        const passwordInput = this.previousElementSibling
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
        passwordInput.setAttribute("type", type)

        // Toggle eye icon
        const icon = this.querySelector("i")
        icon.classList.toggle("fa-eye")
        icon.classList.toggle("fa-eye-slash")
      })
    }
  })

  // Password strength meter
  const passwordInput = document.getElementById("password")
  const progressBar = document.querySelector(".password-strength .progress-bar")

  if (passwordInput && progressBar) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      let strength = 0

      // Check password length
      if (password.length >= 8) {
        strength += 25
      }

      // Check for lowercase letters
      if (/[a-z]/.test(password)) {
        strength += 25
      }

      // Check for uppercase letters
      if (/[A-Z]/.test(password)) {
        strength += 25
      }

      // Check for numbers or special characters
      if (/[0-9!@#$%^&*]/.test(password)) {
        strength += 25
      }

      // Update progress bar
      progressBar.style.width = strength + "%"

      // Update progress bar color
      if (strength <= 25) {
        progressBar.className = "progress-bar bg-danger"
      } else if (strength <= 50) {
        progressBar.className = "progress-bar bg-warning"
      } else if (strength <= 75) {
        progressBar.className = "progress-bar bg-info"
      } else {
        progressBar.className = "progress-bar bg-success"
      }
    })
  }

  // Form validation
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Here you would normally send the data to the server
      // For now, we'll just show an alert
      alert("Login functionality will be implemented with Flask backend.")
    })
  }

  // Quick search functionality
  const quickSearchBtn = document.getElementById("quickSearchBtn")
  if (quickSearchBtn) {
    quickSearchBtn.addEventListener("click", () => {
      const fromLocation = document.getElementById("quickFrom").value
      const toLocation = document.getElementById("quickTo").value
      const travelDate = document.getElementById("quickDate").value

      if (!fromLocation || !toLocation || !travelDate) {
        alert("Please select departure, destination, and travel date.")
        return
      }

      // Here you would normally redirect to search results
      // For now, we'll just show an alert
      alert(
        `Searching for buses from ${fromLocation} to ${toLocation} on ${travelDate}. This functionality will be implemented with Flask backend.`,
      )
    })
  }

  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Check if passwords match
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirmPassword").value

      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // Here you would normally send the data to the server
      // For now, we'll just show an alert
      alert("Sign up functionality will be implemented with Flask backend.")
    })
  }

  // Booking form validation
  const bookingForm = document.querySelector(".booking-form form")
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Here you would normally send the data to the server
      // For now, we'll just show an alert
      alert("Booking functionality will be implemented with Flask backend.")
    })
  }

  // Schedule search functionality
  const searchScheduleBtn = document.getElementById("searchSchedule")
  if (searchScheduleBtn) {
    searchScheduleBtn.addEventListener("click", () => {
      const fromLocation = document.getElementById("fromLocation").value
      const toLocation = document.getElementById("toLocation").value

      if (fromLocation === "From" || toLocation === "To") {
        alert("Please select both departure and destination locations.")
        return
      }

      // Here you would normally fetch the schedules from the server
      // For now, we'll just show an alert
      alert(
        `Searching for buses from ${fromLocation} to ${toLocation}. This functionality will be implemented with Flask backend.`,
      )
    })
  }
})
