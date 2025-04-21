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
    })
  }

  // Initialize date inputs with today's date as minimum
  const dateInputs = document.querySelectorAll('input[type="date"]')
  if (dateInputs.length > 0) {
    const today = new Date().toISOString().split("T")[0]
    dateInputs.forEach((input) => {
      input.min = today
    })
  }

  // Initialize Google Maps if the map element exists
  const mapElement = document.getElementById("map")
  if (mapElement) {
    if (typeof google === "undefined" || typeof initMap === "undefined") {
      console.warn("Google Maps API or initMap function is not defined.")
    }
    if (typeof google !== "undefined" && typeof initMap === "function") {
      initMap()
    } else {
      console.warn("Google Maps API or initMap function is not defined.")
    }
  }

  // Bus details toggle in bus results
  const busRows = document.querySelectorAll(".bus-row")
  if (busRows.length > 0) {
    busRows.forEach((row) => {
      row.addEventListener("click", function () {
        const busId = this.getAttribute("data-bus-id")
        const detailsRow = document.getElementById("bus-details-" + busId)

        if (detailsRow) {
          if (detailsRow.style.display === "none" || !detailsRow.style.display) {
            // Hide all other details rows
            document.querySelectorAll(".bus-details-row").forEach((r) => {
              r.style.display = "none"
            })

            // Show this details row
            detailsRow.style.display = "table-row"
          } else {
            detailsRow.style.display = "none"
          }
        }
      })
    })
  }

  // Payment method selection
  const paymentOptions = document.querySelectorAll(".payment-option")
  if (paymentOptions.length > 0) {
    paymentOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Find the radio input inside this option and check it
        const radio = this.querySelector('input[type="radio"]')
        if (radio) {
          radio.checked = true

          // Trigger the change event
          const event = new Event("change")
          radio.dispatchEvent(event)
        }
      })
    })
  }
})
