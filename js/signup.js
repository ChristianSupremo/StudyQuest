document.getElementById('signup-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMessage = document.getElementById('error-message');

  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';

  // Validate fields
  if (!username || !email || !password || !confirmPassword) {
    showError('⚠️ Please fill in all required fields.');
    return;
  }

  if (password !== confirmPassword) {
    showError('❌ Passwords do not match.');
    return;
  }

  // Simulate a "user database" with localStorage
  let users = JSON.parse(localStorage.getItem('studyquest-users')) || [];

  // Check for duplicate email
  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    showError('⚠️ Email is already registered.');
    return;
  }

  // Save the new user
  users.push({ username, email, password });
  localStorage.setItem('studyquest-users', JSON.stringify(users));

  // Optionally, auto-login the user
  localStorage.setItem('studyquest-current-user', JSON.stringify({ username, email }));

  // Show success modal
  document.getElementById('success-modal').classList.remove('hidden');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 2000);

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
});
