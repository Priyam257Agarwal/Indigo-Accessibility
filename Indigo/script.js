document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById('bookingForm');
    const searchButton = document.getElementById('searchFlight');
    const errorPopup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmButton = document.getElementById('confirmButton');
    let lastFocusedElement = null;

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();

        const fields = ['from', 'to', 'deptarture', 'return', 'passengerNo'];
        const [from, to, departureValue, returnValue, passengers] = fields.map(field => document.querySelector(`input[name="${field}"]`).value);
        const travelPurpose = document.getElementById('travelOpt').value;

        let messages = [];

        if (!from) messages.push('Enter your departure city.');
        if (!to) messages.push('Enter your destination city.');
        if (!departureValue) messages.push('Select a departure date.');
        if (!returnValue) messages.push('Select a return date.');
        if (departureValue && returnValue && new Date(departureValue) >= new Date(returnValue)) {
            messages.push('The departure date must be before the return date.');
        }
        if (!passengers) messages.push('Mention the number of passengers.');
        if (!travelPurpose) messages.push('Select your travel purpose.');

        if (messages.length > 0) {
            errorMessage.innerHTML = messages.join('<br>');
            errorPopup.style.display = 'block';

            fields.forEach(field => {
                document.querySelector(`input[name="${field}"]`).addEventListener('input', () => {
                    const remainingMessages = messages.filter(msg => !msg.includes(document.querySelector(`input[name="${field}"]`).value));
                    errorMessage.innerHTML = remainingMessages.join('<br>');
                    if (remainingMessages.length === 0) {
                        errorPopup.style.display = 'none';
                    }
                });
            });
        } else {
            openModal(); // Open modal only after successful validation
        }
    });

    // Function to open modal and trap focus inside modal
    function openModal() {
        lastFocusedElement = document.activeElement; // Save last focused element
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open'); // Add class to disable background scroll
        closeModalBtn.focus(); // Focus the close button in the modal

        document.addEventListener('keydown', trapFocus);
    }

    // Function to close modal and restore focus
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Remove class to restore background scroll
        lastFocusedElement.focus(); // Return focus to the element that opened the modal

        document.removeEventListener('keydown', trapFocus);
    }

    // Function to trap focus inside the modal
    function trapFocus(event) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus(); // Loop focus to last element
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus(); // Loop focus to first element
                }
            }
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }

    // Close modal on close button or outside click
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Confirm button click event - Form submission and alert after modal confirmation
    confirmButton.addEventListener('click', () => {
        closeModal(); // Close modal first
        alert("Ticket Booking has been made successfully!"); // Show alert after closing the modal
        bookingForm.submit(); // Submit form
    });

    //Accordian Code
    const accordionButtons = document.querySelectorAll('.accordion button');

    accordionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);

        const content = document.getElementById(button.getAttribute('aria-controls'));
        if (!expanded) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    });    
});
