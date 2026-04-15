// register.js - Updated for PrepWise AI Platform
const registerForm = document.getElementById('registerForm');
const errorAlert = document.getElementById('error-alert');

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Capture values from the HTML inputs
    const nameValue = document.getElementById('reg-fullname').value;
    const emailValue = document.getElementById('reg-email').value;
    const passwordValue = document.getElementById('reg-password').value;
    const confirmPasswordValue = document.getElementById('reg-confirm-password').value;
    const submitBtn = document.getElementById('register-btn');

    // 1. Basic Client Validation
    if (passwordValue !== confirmPasswordValue) {
        showError("Passwords do not match!");
        return;
    }

    if (passwordValue.length < 6) {
        showError("Password must be at least 6 characters.");
        return;
    }

    // 2. Prepare Data 
    // FIXED: Changed key to 'name' based on your backend 400 error response
    const userData = {
        name: nameValue, 
        email: emailValue,
        password: passwordValue
    };

    // UI Feedback: Loading State
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;
    errorAlert.classList.add('d-none');

    try {
        // 3. API Call to your Django Backend
        const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            // 4. Success Case
            console.log("Success:", data);
            alert("Registration successful! Redirecting to login...");
            window.location.href = "login.html";
        } else {
            // 5. Handling 400 Bad Request / Validation Errors
            console.error("Backend Validation Error:", data);
            
            // Extract the first error message available dynamically
            let firstKey = Object.keys(data)[0];
            let message = data[firstKey];
            
            // If the message is an array (common in DRF), grab the first string
            if (Array.isArray(message)) {
                message = message[0];
            } else if (typeof message === 'object') {
                // Handle nested object errors if they exist
                message = JSON.stringify(message);
            }
            
            showError(`${firstKey.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        // Handling Network/Server connectivity issues
        showError("Cannot connect to the server. Is your Django runserver active?");
        console.error("Connection error:", error);
    } finally {
        // Reset button state
        submitBtn.innerText = "Register";
        submitBtn.disabled = false;
    }
});

/**
 * UI Helper: Displays error message in the alert div
 */
function showError(message) {
    errorAlert.innerText = message;
    errorAlert.classList.remove('d-none');
    // Scroll to top of form so user sees the error
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/**
 * UI Helper: Toggles visibility for password fields
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}