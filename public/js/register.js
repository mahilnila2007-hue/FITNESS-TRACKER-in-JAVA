// Register Form Handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    let isValid = true;
    
    if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Send registration request to backend
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message
            showSuccessAlert('Account created successfully! Redirecting to login...');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert('registerAlert', data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        showAlert('registerAlert', 'An error occurred. Please try again later.');
        console.error('Registration error:', error);
    }
});

// Helper Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    
    const inputElement = errorElement.previousElementSibling;
    if (elementId === 'confirmPasswordError') {
        inputElement.previousElementSibling.classList.add('error');
    }
    inputElement.classList.add('error');
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    
    const alert = document.getElementById('registerAlert');
    alert.style.display = 'none';
}

function showAlert(elementId, message) {
    const alertElement = document.getElementById(elementId);
    alertElement.textContent = message;
    alertElement.className = 'alert alert-error';
    alertElement.style.display = 'block';
}

function showSuccessAlert(message) {
    const alertElement = document.getElementById('registerAlert');
    alertElement.textContent = message;
    alertElement.className = 'alert alert-success';
    alertElement.style.display = 'block';
}

// Clear errors on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorId = input.id + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});
