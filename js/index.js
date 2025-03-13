function initializeModal(modalId, buttonId) {
    const modal = document.getElementById(modalId);
    const button = document.getElementById(buttonId);
    
    if (!modal || !button) {
      console.error(`Modal initialization failed: Could not find modal #${modalId} or button #${buttonId}`);
      return;
    }
    
    const closeButton = modal.querySelector('.modal-close');
    
    if (!closeButton) {
      console.error(`Modal initialization failed: Could not find close button in modal #${modalId}`);
      return;
    }
    
    // Ensure modal starts hidden
    modal.classList.add('hidden');
    
    // Open the modal when the button is clicked
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal);
    });
    
    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', () => {
      closeModal(modal);
    });
    
    // Close the modal when clicking the backdrop (outside the modal)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
    
    // Close the modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal(modal);
      }
    });
  }

  /**
   * Opens a modal with animation
   * @param {HTMLElement} modal - The modal element to open
   */
  function openModal(modal) {
    // Make sure the modal is visible
    modal.classList.remove('hidden');
    
    // Add animation classes
    modal.classList.add('modal-fade-in');
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.classList.add('modal-slide-in');
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes a modal with an animation
   * @param {HTMLElement} modal - The modal element to close
   */
  function closeModal(modal) {
    // Add animation classes for closing
    modal.classList.add('modal-fade-out');
    modal.classList.remove('modal-fade-in');
    
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.classList.add('modal-slide-out');
      container.classList.remove('modal-slide-in');
    }
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('modal-fade-out');
      
      if (container) {
        container.classList.remove('modal-slide-out');
      }
      
      // Restore body scrolling
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Initialize the appointment request modal after DOM load
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the appointment request modal
    initializeModal('appointmentModal', 'requestAppointmentBtn');
    
    // Handle form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const reason = document.getElementById('appointmentReason').value;
        const date = document.getElementById('appointmentDate').value;
        
        // Do something with the data (e.g., send to server)
        console.log('Appointment requested:', { reason, date });
        
        // Close the modal after submission
        closeModal(document.getElementById('appointmentModal'));
        
        // Reset form
        appointmentForm.reset();
      });
    }
  });

  // Make these functions available globally
  window.initializeModal = initializeModal;
  window.openModal = openModal;
  window.closeModal = closeModal;