document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const errorMessage = document.getElementById('error-message');
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === '' || password === '') {
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = '⚠️ Please fill in both email and password.';
  } else {
    // Fake success login for frontend-only mode
    document.getElementById('success-modal').classList.remove('hidden');

    setTimeout(function () {
      window.location.href = `${window.location.origin}/StudyQuest/dashboard.html`;
    }, 2000); // shorter delay
  }
});
