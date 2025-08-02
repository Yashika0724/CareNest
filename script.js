// Get references to modal elements
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');

// Get references to links/buttons that open/close modals
const signInLink = document.getElementById('signInLink');
const signUpLink = document.getElementById('signUpLink');
const switchToSignUpLink = document.getElementById('switchToSignUp');
const switchToSignInLink = document.getElementById('switchToSignIn');

// Get all close buttons within modals
const closeButtons = document.querySelectorAll('.modal-overlay .close-button');

// Function to open a modal
function openModal(modal) {
  modal.classList.add('active');
  document.body.classList.add('modal-open'); // Add class to body for blur effect
}

// Function to close a modal
function closeModal(modal) {
  modal.classList.remove('active');
  document.body.classList.remove('modal-open'); // Remove class from body
}

// Event Listeners for opening modals
signInLink.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default link behavior
  openModal(signInModal);
});

signUpLink.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(signUpModal);
});

// Event Listeners for closing modals (using close buttons)
closeButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    closeModal(e.target.closest('.modal-overlay'));
  });
});

// Event Listeners for switching between sign in/sign up forms
switchToSignUpLink.addEventListener('click', (e) => {
  e.preventDefault();
  closeModal(signInModal);
  openModal(signUpModal);
});

switchToSignInLink.addEventListener('click', (e) => {
  e.preventDefault();
  closeModal(signUpModal);
  openModal(signInModal);
});

// Close modal when clicking outside the modal content
signInModal.addEventListener('click', (e) => {
  if (e.target === signInModal) {
    closeModal(signInModal);
  }
});

signUpModal.addEventListener('click', (e) => {
  if (e.target === signUpModal) {
    closeModal(signUpModal);
  }
});

// Prevent form submission for demonstration (remove in production with actual backend)
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would send data to a server here
        alert('Form submitted! (This is a demo, no actual submission)');
        closeModal(e.target.closest('.modal-overlay')); // Close modal after fake submission
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Chatbot elements
    const chatbotContainer = document.querySelector('.chatbot-container');
    const openChatbotButton = document.getElementById('openChatbotButton'); // This ID is crucial
    const closeChatbotButton = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const userInput = document.getElementById('userInput');
    const sendMessageButton = document.getElementById('sendMessage');

    // Modal elements (assuming you have these in your script.js already)
    const signInLink = document.getElementById('signInLink');
    const signUpLink = document.getElementById('signUpLink');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const closeButtons = document.querySelectorAll('.close-button'); // For all modals
    const switchToSignUpLink = document.getElementById('switchToSignUp');
    const switchToSignInLink = document.getElementById('switchToSignIn');

    // Function to open modal
    function openModal(modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open'); // To prevent scrolling behind modal
    }

    // Function to close modal
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Event Listeners for Modals
    if (signInLink) signInLink.addEventListener('click', (e) => { e.preventDefault(); openModal(signInModal); });
    if (signUpLink) signUpLink.addEventListener('click', (e) => { e.preventDefault(); openModal(signUpModal); });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    if (switchToSignUpLink) switchToSignUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signInModal);
        openModal(signUpModal);
    });

    if (switchToSignInLink) switchToSignInLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signUpModal);
        openModal(signInModal);
    });

    // Close modal if clicked outside content
    if (signInModal) signInModal.addEventListener('click', (e) => {
        if (e.target === signInModal) closeModal(signInModal);
    });
    if (signUpModal) signUpModal.addEventListener('click', (e) => {
        if (e.target === signUpModal) closeModal(signUpModal);
    });

    // --- Chatbot Logic ---
    if (openChatbotButton) { // Check if the button exists before adding listener
        openChatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            openChatbotButton.style.display = 'none'; // Hide the open button when chat is open
        });
    }

    if (closeChatbotButton) { // Check if the button exists before adding listener
        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
            openChatbotButton.style.display = 'flex'; // Show the open button when chat is closed
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        userInput.value = '';

        // Simulate typing indicator (optional)
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message');
        typingIndicator.innerHTML = '<em>Bot is typing...</em>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            // Send message to your backend for AI processing
            const response = await fetch('http://localhost:3000/chat', { // Replace with your actual backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            chatbotMessages.removeChild(typingIndicator); // Remove typing indicator
            addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error sending message to chatbot backend:', error);
            chatbotMessages.removeChild(typingIndicator); // Remove typing indicator
            addMessage("Oops! I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }

    if (sendMessageButton) sendMessageButton.addEventListener('click', sendMessage);
    if (userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});