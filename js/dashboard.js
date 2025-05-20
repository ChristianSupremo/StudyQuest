document.addEventListener('DOMContentLoaded', function () {
  // Username logic
  const usernameDisplay = document.getElementById('usernameDisplay');
  const usernameInput = document.getElementById('usernameInput');
  const editNameBtn = document.getElementById('editNameBtn');

  editNameBtn.addEventListener('click', () => {
    usernameInput.classList.toggle('hidden');
    if (!usernameInput.classList.contains('hidden')) {
      usernameInput.value = usernameDisplay.textContent;
      usernameInput.focus();
    }
  });

  usernameInput.addEventListener('change', () => {
    usernameDisplay.textContent = usernameInput.value || 'Student';
    localStorage.setItem('studyquest-username', usernameInput.value);
    usernameInput.classList.add('hidden');
  });

  // Avatar logic
  const avatarImg = document.getElementById('avatarImg');
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');

  changeAvatarBtn.addEventListener('click', () => avatarInput.click());

  avatarInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarImg.src = e.target.result;
      localStorage.setItem('studyquest-avatar', e.target.result);
    };
    if (avatarInput.files[0]) {
      reader.readAsDataURL(avatarInput.files[0]);
    }
  });

  // About Me
  const aboutMe = document.getElementById('aboutMe');
  aboutMe.addEventListener('input', () => {
    localStorage.setItem('studyquest-about', aboutMe.value);
  });

  // Load saved data
  const savedName = localStorage.getItem('studyquest-username');
  if (savedName) usernameDisplay.textContent = savedName;

  const savedAvatar = localStorage.getItem('studyquest-avatar');
  if (savedAvatar) avatarImg.src = savedAvatar;

  const savedAbout = localStorage.getItem('studyquest-about');
  if (savedAbout) aboutMe.value = savedAbout;

  // Pomodoro Logic with Session Types
  let timerInterval;
  let isRunning = false;
  let currentMode = 'pomodoro';
  let timeLeft = 25 * 60;

  const sessionTimes = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');

  const sessionButtons = {
    pomodoro: document.getElementById('pomodoro-btn'),
    short: document.getElementById('short-btn'),
    long: document.getElementById('long-btn'),
  };

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = `Start ${formatMode(currentMode)}`;
        alert('⏰ Session complete!');
      }
    }, 1000);
  }

  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      startTimer();
      startBtn.textContent = 'Pause';
      isRunning = true;
    } else {
      clearInterval(timerInterval);
      startBtn.textContent = 'Resume';
      isRunning = false;
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timeLeft = sessionTimes[currentMode];
    updateDisplay();
    startBtn.textContent = `Start ${formatMode(currentMode)}`;
    isRunning = false;
  });

  Object.entries(sessionButtons).forEach(([mode, button]) => {
    button.addEventListener('click', () => {
      clearInterval(timerInterval);
      currentMode = mode;
      timeLeft = sessionTimes[mode];
      updateDisplay();
      startBtn.textContent = `Start ${formatMode(mode)}`;
      isRunning = false;
      highlightActiveButton(mode);
    });
  });

  function highlightActiveButton(activeMode) {
    Object.entries(sessionButtons).forEach(([mode, btn]) => {
      if (mode === activeMode) {
        btn.classList.add('ring', 'ring-offset-2', 'ring-black');
      } else {
        btn.classList.remove('ring', 'ring-offset-2', 'ring-black');
      }
    });
  }

  function formatMode(mode) {
    switch (mode) {
      case 'pomodoro':
        return 'Pomodoro';
      case 'short':
        return 'Short Break';
      case 'long':
        return 'Long Break';
      default:
        return '';
    }
  }

  updateDisplay();
  highlightActiveButton(currentMode);
});
