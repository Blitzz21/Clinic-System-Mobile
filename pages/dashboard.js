// Setup delete buttons
function setupDeleteButtons(container = document) {
    const deleteButtons = container.querySelectorAll(".delete-task");
    deleteButtons.forEach((button) => {
      // Skip if already initialized
      if (button.dataset.initialized) return;
      button.dataset.initialized = "true";
  
      button.addEventListener("click", function () {
        const taskItem = this.closest(".task-item");
  
        // Add removal animation
        taskItem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        taskItem.style.opacity = "0";
        taskItem.style.transform = "translateX(20px)";
  
        // Remove after animation completes
        setTimeout(() => {
          taskItem.remove();
          updateTaskProgress();
        }, 300);
      });
    });
  }
  
  // Update task progress
  function updateTaskProgress() {
    const totalTasks = document.querySelectorAll(".task-item").length;
    const completedTasks = document.querySelectorAll(
      ".task-item.completed",
    ).length;
  
    // Update progress bar with animation
    const progressBar = document.getElementById("task-progress");
    const currentWidth = parseInt(progressBar.style.width) || 0;
    const targetWidth = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
    // Animate the progress bar
    animateProgressBar(progressBar, currentWidth, targetWidth);
  
    // Update completion text
    document.getElementById("task-completion").textContent =
      `${completedTasks}/${totalTasks} Complete`;
  }
  
  // Animate progress bar
  function animateProgressBar(element, start, end) {
    const duration = 500;
    const startTime = performance.now();
  
    function updateProgress(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentProgress = start + (end - start) * progress;
  
      element.style.width = `${currentProgress}%`;
  
      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    }
  
    requestAnimationFrame(updateProgress);
  }
  
  // Show toast message
  function showToast(title, message) {
    const toast = document.getElementById("success-toast");
    toast.querySelector(".font-medium").textContent = title;
    toast.querySelector(".text-sm").textContent = message;
  
    // Show toast
    toast.classList.remove("translate-y-full", "opacity-0");
  
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.add("translate-y-full", "opacity-0");
    }, 3000);
  }
  
  // Setup weather card interactions
  function setupWeatherInteractions() {
    // Toggle forecast view when clicking on temperature
    document
      .getElementById("weather-temp")
      .addEventListener("click", function () {
        const forecastElement = document.getElementById("weather-forecast");
        weatherExpanded = !weatherExpanded;
  
        if (weatherExpanded) {
          forecastElement.classList.remove("hidden");
          forecastElement.style.maxHeight = "0";
          forecastElement.style.opacity = "0";
          setTimeout(() => {
            forecastElement.style.maxHeight = "100px";
            forecastElement.style.opacity = "1";
          }, 10);
        } else {
          forecastElement.style.maxHeight = "0";
          forecastElement.style.opacity = "0";
          setTimeout(() => {
            forecastElement.classList.add("hidden");
          }, 300);
        }
      });
  
    // Refresh weather data
    document
      .getElementById("refresh-weather")
      .addEventListener("click", function () {
        this.querySelector("i").classList.add("fa-spin");
        fetchWeather(currentLocation).then(() => {
          setTimeout(() => {
            this.querySelector("i").classList.remove("fa-spin");
          }, 500);
        });
      });
  
    // Change location
    document
      .getElementById("change-location")
      .addEventListener("click", function () {
        const newLocation = prompt(
          'Enter city name (e.g. "London,uk" or "Tokyo,jp"):',
          currentLocation,
        );
        if (newLocation && newLocation.trim() !== "") {
          fetchWeather(newLocation.trim());
        }
      });
  
    // Add CSS for transitions
    const style = document.createElement("style");
    style.textContent = `
      #weather-forecast {
        max-height: 0;
        opacity: 0;
        transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        overflow: hidden;
      }
      #weather-forecast:not(.hidden) {
        max-height: 100px;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Setup appointment interactions
  document
    .getElementById("add-appointment-shortcut")
    .addEventListener("click", function () {
      document.getElementById("appointment-modal").classList.remove("hidden");
    });
  
  // Setup appointment action buttons
  document
    .querySelectorAll("#appointments-container button")
    .forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        const action = this.getAttribute("title");
        const appointmentElement = this.closest('div[class*="border-l-4"]');
        const appointmentType =
          appointmentElement.querySelector("p.font-medium").textContent;
  
        if (action === "Cancel") {
          if (
            confirm(
              `Are you sure you want to cancel your ${appointmentType} appointment?`,
            )
          ) {
            // Add removal animation
            appointmentElement.style.transition =
              "opacity 0.3s ease, transform 0.3s ease";
            appointmentElement.style.opacity = "0";
            appointmentElement.style.transform = "translateX(20px)";
  
            // Remove after animation completes
            setTimeout(() => {
              appointmentElement.remove();
              showToast(
                "Appointment Cancelled",
                `Your ${appointmentType} appointment has been cancelled.`,
              );
            }, 300);
          }
        } else if (action === "Reschedule") {
          document.getElementById("appointment-modal").classList.remove("hidden");
          // Pre-fill the form
          const appointmentReason = document.getElementById("appointment-reason");
          if (appointmentType === "General Check-up") {
            appointmentReason.value = "checkup";
          } else if (appointmentType === "Vaccination") {
            appointmentReason.value = "vaccination";
          }
          showToast(
            "Reschedule",
            `Please select a new date and time for your ${appointmentType}.`,
          );
        } else if (action === "Confirm") {
          // Change status to confirmed
          const statusBadge = appointmentElement.querySelector(
            'div[class*="rounded-full"]',
          );
          statusBadge.className =
            "text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full";
          statusBadge.textContent = "Confirmed";
  
          // Change border color
          appointmentElement.classList.remove(
            "border-yellow-500",
            "bg-yellow-50",
          );
          appointmentElement.classList.add("border-indigo-500", "bg-indigo-50");
  
          // Update icon container
          const iconContainer = appointmentElement.querySelector(
            'div[class*="bg-yellow-100"]',
          );
          iconContainer.className = "bg-indigo-100 p-2 rounded-full mr-3";
  
          // Update icon
          const icon = iconContainer.querySelector("i");
          icon.className = "fas fa-calendar-check text-indigo-600";
  
          // Remove confirm button
          this.remove();
  
          showToast(
            "Appointment Confirmed",
            `Your ${appointmentType} appointment has been confirmed.`,
          );
        }
      });
    });
  
  // Appointment modal functionality
  const appointmentModal = document.getElementById("appointment-modal");
  const requestAppointmentBtn = document.getElementById(
    "request-appointment-btn",
  );
  const closeModalBtn = document.getElementById("close-modal");
  const cancelAppointmentBtn = document.getElementById("cancel-appointment");
  const submitAppointmentBtn = document.getElementById("submit-appointment");
  const appointmentReason = document.getElementById("appointment-reason");
  const otherReasonContainer = document.getElementById("other-reason-container");
  
  // Open modal
  requestAppointmentBtn.addEventListener("click", () => {
    appointmentModal.classList.remove("hidden");
  });
  
  // Close modal
  function closeModal() {
    appointmentModal.classList.add("hidden");
  }
  
  closeModalBtn.addEventListener("click", closeModal);
  cancelAppointmentBtn.addEventListener("click", closeModal);
  
  // Show/hide other reason field
  appointmentReason.addEventListener("change", () => {
    if (appointmentReason.value === "other") {
      otherReasonContainer.classList.remove("hidden");
    } else {
      otherReasonContainer.classList.add("hidden");
    }
  });
  
  // Submit appointment request
  submitAppointmentBtn.addEventListener("click", () => {
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const reason = appointmentReason.value;
  
    if (!date || !time || !reason) {
      alert("Please fill in all required fields");
      return;
    }
  
    // Close modal
    closeModal();
  
    // Show success toast
    showToast(
      "Appointment Requested",
      "Your appointment request has been submitted successfully.",
    );
  });
  
  // Close modal when clicking outside
  appointmentModal.addEventListener("click", (e) => {
    if (e.target === appointmentModal) {
      closeModal();
    }
  });
  
  // Profile image upload functionality
  const profileImageUpload = document.getElementById("profile-image-upload");
  const profileImage = document.getElementById("profile-image");
  const defaultProfileIcon = document.getElementById("default-profile-icon");
  
  profileImageUpload.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        profileImage.src = e.target.result;
        profileImage.classList.remove("hidden");
        defaultProfileIcon.classList.add("hidden");
  
        // Update header image too
        document.getElementById("profile-header-img").src = e.target.result;
  
        // Save to localStorage
        localStorage.setItem("profileImage", e.target.result);
      };
  
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  // Account settings editing functionality
  const editAccountSettings = document.getElementById("edit-account-settings");
  const cancelAccountSettings = document.getElementById(
    "cancel-account-settings",
  );
  const saveAccountSettings = document.getElementById("save-account-settings");
  const accountSettings = document.getElementById("account-settings");
  
  // Store original values for cancel operation
  let originalValues = {};
  
  editAccountSettings.addEventListener("click", function () {
    // Store original values
    originalValues = {
      name: document.getElementById("name-display").textContent,
      email: document.getElementById("email-display").textContent,
      phone: document.getElementById("phone-display").textContent,
      department: document.getElementById("department-display").textContent,
    };
  
    // Show edit mode
    accountSettings.classList.add("edit-mode");
    document.getElementById("name-input").classList.remove("hidden");
    document.getElementById("email-input").classList.remove("hidden");
    document.getElementById("phone-input").classList.remove("hidden");
    document.getElementById("department-input").classList.remove("hidden");
  
    document.getElementById("name-display").classList.add("hidden");
    document.getElementById("email-display").classList.add("hidden");
    document.getElementById("phone-display").classList.add("hidden");
    document.getElementById("department-display").classList.add("hidden");
  
    editAccountSettings.classList.add("hidden");
    document
      .querySelector("#account-settings .save-cancel")
      .classList.remove("hidden");
  });
  
  cancelAccountSettings.addEventListener("click", function () {
    // Restore original values
    document.getElementById("name-input").value = originalValues.name;
    document.getElementById("email-input").value = originalValues.email;
    document.getElementById("phone-input").value = originalValues.phone;
  
    // Find and select the original department option
    const departmentSelect = document.getElementById("department-input");
    for (let i = 0; i < departmentSelect.options.length; i++) {
      if (departmentSelect.options[i].value === originalValues.department) {
        departmentSelect.selectedIndex = i;
        break;
      }
    }
  
    // Exit edit mode
    accountSettings.classList.remove("edit-mode");
    document.getElementById("name-input").classList.add("hidden");
    document.getElementById("email-input").classList.add("hidden");
    document.getElementById("phone-input").classList.add("hidden");
    document.getElementById("department-input").classList.add("hidden");
  
    document.getElementById("name-display").classList.remove("hidden");
    document.getElementById("email-display").classList.remove("hidden");
    document.getElementById("phone-display").classList.remove("hidden");
    document.getElementById("department-display").classList.remove("hidden");
  
    editAccountSettings.classList.remove("hidden");
    document
      .querySelector("#account-settings .save-cancel")
      .classList.add("hidden");
  });
  
  saveAccountSettings.addEventListener("click", function () {
    // Get new values
    const newName = document.getElementById("name-input").value;
    const newEmail = document.getElementById("email-input").value;
    const newPhone = document.getElementById("phone-input").value;
    const newDepartment = document.getElementById("department-input").value;
  
    // Update display values
    document.getElementById("name-display").textContent = newName;
    document.getElementById("email-display").textContent = newEmail;
    document.getElementById("phone-display").textContent = newPhone;
    document.getElementById("department-display").textContent = newDepartment;
  
    // Update dashboard greeting
    document.getElementById("user-name").textContent = newName.split(" ")[0];
  
    // Save to localStorage
    const accountData = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      department: newDepartment,
    };
    localStorage.setItem("accountData", JSON.stringify(accountData));
  
    // Exit edit mode
    accountSettings.classList.remove("edit-mode");
    document.getElementById("name-input").classList.add("hidden");
    document.getElementById("email-input").classList.add("hidden");
    document.getElementById("phone-input").classList.add("hidden");
    document.getElementById("department-input").classList.add("hidden");
  
    document.getElementById("name-display").classList.remove("hidden");
    document.getElementById("email-display").classList.remove("hidden");
    document.getElementById("phone-display").classList.remove("hidden");
    document.getElementById("department-display").classList.remove("hidden");
  
    editAccountSettings.classList.remove("hidden");
    document
      .querySelector("#account-settings .save-cancel")
      .classList.add("hidden");
  
    // Show success message
    showToast(
      "Account Updated",
      "Your account information has been updated successfully.",
    );
  });
  
  // Delete notification functionality
  document.querySelectorAll(".delete-notification").forEach((btn) => {
    btn.addEventListener("click", () => {
      const notificationItem = btn.closest(".notification-item");
      notificationItem.remove();
    });
  });
  
  // Mark all as read functionality
  document.getElementById("mark-all-read").addEventListener("click", () => {
    const notifications = document.querySelectorAll(".notification-item");
    notifications.forEach((notification) => {
      notification.classList.add("opacity-50");
      const indicator = notification.querySelector(".bg-indigo-500");
      if (indicator) {
        indicator.classList.remove("bg-indigo-500");
        indicator.classList.add("bg-gray-300");
      }
    });
  });
  
  // Responsive behavior - adjust container width based on screen size
  function adjustContainerWidth() {
    const container = document.getElementById("dashboard-container");
    if (window.innerWidth >= 1280) {
      container.style.maxWidth = "1140px";
    } else if (window.innerWidth >= 1024) {
      container.style.maxWidth = "960px";
    } else if (window.innerWidth >= 768) {
      container.style.maxWidth = "720px";
    } else if (window.innerWidth >= 641) {
      container.style.maxWidth = "540px";
    } else {
      container.style.maxWidth = "100%";
      container.style.borderRadius = "0";
      container.style.marginLeft = "0";
      container.style.marginRight = "0";
    }
  }
  
  // Initialize all components
  window.addEventListener("load", function () {
    // Load account data
    const savedAccountData = localStorage.getItem("accountData");
    if (savedAccountData) {
      const accountData = JSON.parse(savedAccountData);
      document.getElementById("name-display").textContent = accountData.name;
      document.getElementById("email-display").textContent = accountData.email;
      document.getElementById("phone-display").textContent = accountData.phone;
      document.getElementById("department-display").textContent =
        accountData.department;
  
      document.getElementById("name-input").value = accountData.name;
      document.getElementById("email-input").value = accountData.email;
      document.getElementById("phone-input").value = accountData.phone;
  
      // Set the department select value
      const departmentSelect = document.getElementById("department-input");
      for (let i = 0; i < departmentSelect.options.length; i++) {
        if (departmentSelect.options[i].value === accountData.department) {
          departmentSelect.selectedIndex = i;
          break;
        }
      }
    }
  
    // Initialize dashboard components
    loadUserData();
    initCharts();
    fetchWeather();
    initTasks();
    adjustContainerWidth();
  
    // Initialize theme toggle
    initThemeToggle();
  
    // Setup weather card interactions
    setupWeatherInteractions();
  });
  
  window.addEventListener("resize", adjustContainerWidth);
  