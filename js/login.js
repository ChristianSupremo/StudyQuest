document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const errorMessage = document.getElementById('error-message');
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Simulated users (replace this with real backend validation in production)
  const fakeUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'christianjasonsupremo@gmail.com', password: 'studyquest' }
  ];

  // Basic validation
  if (!email || !password) {
    showError('⚠️ Please fill in both email and password.');
    return;
  }

  if (!validateEmail(email)) {
    showError('⚠️ Please enter a valid email address.');
    return;
  }

  const userMatch = fakeUsers.find(user => user.email === email && user.password === password);

  if (!userMatch) {
    showError('❌ Invalid email or password.');
    return;
  }

  // Successful login
  document.getElementById('success-modal').classList.remove('hidden');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 2000);
});

function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function validateEmail(email) {
  // Simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
