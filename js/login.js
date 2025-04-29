document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    
    // Clear any previous error message
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden');
    errorMessage.textContent = ''; // Clear the text message
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation
    if (email === '' || password === '') {
      errorMessage.classList.remove('hidden');
      errorMessage.textContent = '⚠️ Please fill in both email and password.';
    } else if (email === 'admin@panel.com' && password === 'admin') {
      // Successful login
      document.getElementById('success-modal').classList.remove('hidden');
      
      // Redirect after 3 seconds
      setTimeout(function() {
        window.location.href = 'dashboard.html'; // Replace with real dashboard page
      }, 3000);
    } else {
      // Incorrect login
      errorMessage.classList.remove('hidden');
      errorMessage.textContent = '⚠️ Invalid email or password.';
    }
  });
  