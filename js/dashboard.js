document.addEventListener('DOMContentLoaded', function () {
  // --- Username logic ---
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

  // --- Avatar logic ---
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

  // --- About Me ---
  const aboutMe = document.getElementById('aboutMe');
  aboutMe.addEventListener('input', () => {
    localStorage.setItem('studyquest-about', aboutMe.value);
  });

  // --- Load saved data ---
  const savedName = localStorage.getItem('studyquest-username');
  if (savedName) usernameDisplay.textContent = savedName;

  const savedAvatar = localStorage.getItem('studyquest-avatar');
  if (savedAvatar) avatarImg.src = savedAvatar;

  const savedAbout = localStorage.getItem('studyquest-about');
  if (savedAbout) aboutMe.value = savedAbout;

  // --- Pomodoro Logic ---
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
      btn.classList.toggle('ring', mode === activeMode);
      btn.classList.toggle('ring-offset-2', mode === activeMode);
      btn.classList.toggle('ring-black', mode === activeMode);
    });
  }

  function formatMode(mode) {
    return {
      pomodoro: 'Pomodoro',
      short: 'Short Break',
      long: 'Long Break',
    }[mode] || '';
  }

  updateDisplay();
  highlightActiveButton(currentMode);

  // --- XP System Setup ---
  const XP_PER_LEVEL = 300;
  let totalXP = parseInt(localStorage.getItem('studyquest-xp')) || 0;
  let previousLevel = Math.floor(totalXP / XP_PER_LEVEL);

  const xpBar = document.getElementById('xpBar');
  const xpText = document.getElementById('xpText');
  const levelDisplay = document.getElementById('levelDisplay');

  function updateXPDisplay() {
    const level = Math.floor(totalXP / XP_PER_LEVEL);
    const currentXP = totalXP % XP_PER_LEVEL;
    const percentage = (currentXP / XP_PER_LEVEL) * 100;

    xpBar.style.width = `${percentage}%`;
    xpText.textContent = `XP: ${currentXP} / ${XP_PER_LEVEL}`;
    levelDisplay.textContent = `Level ${level}`;

    if (level > previousLevel) {
      showLevelUpModal(level);
    }

    previousLevel = level;
  }

  function saveXP() {
    localStorage.setItem('studyquest-xp', totalXP);
  }

  updateXPDisplay();

  function showLevelUpModal(newLevel) {
    const modal = document.getElementById('levelUpModal');
    const message = document.getElementById('levelUpMessage');
    const closeBtn = document.getElementById('closeLevelUpModal');

    message.innerHTML = `You've reached <span class="font-bold text-green-600">Level ${newLevel}</span>!`;
    modal.classList.remove('hidden');

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }



  // --- Quest System Update ---
  const questsContainer = document.querySelector('.grid.gap-4');
  const QUESTS_KEY = 'studyquest-quests';

  let quests = JSON.parse(localStorage.getItem(QUESTS_KEY)) || [];

  function saveQuests() {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  }

  function getTimeRemaining(dueDateStr) {
    const dueDate = new Date(dueDateStr);
    if (isNaN(dueDate)) {
      return { text: dueDateStr, class: 'text-gray-400' }; // fallback for legacy quests
    }

    const now = new Date();
    const diff = dueDate - now;

    if (diff <= 0) return { text: 'Overdue', class: 'text-red-500' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    let dueText = `Due in ${days}d ${hours}h ${minutes}m`;

    let dueClass = 'text-indigo-500';
    if (days < 1) dueClass = 'text-red-500';
    else if (days === 1) dueClass = 'text-yellow-500';

    return { text: dueText, class: dueClass };
  }

  function renderQuests() {
    questsContainer.innerHTML = '';

    quests.forEach((quest) => {
      const { text: dueText, class: dueClass } = getTimeRemaining(quest.due);

      const questEl = document.createElement('div');
      questEl.className = 'bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 flex items-center justify-between';

      questEl.innerHTML = `
        <div class="flex items-center gap-4">
          <input type="checkbox" class="h-5 w-5 accent-blue-600" data-id="${quest.id}" ${quest.completed ? 'checked' : ''}>
          <div>
            <div class="flex items-center gap-2 text-lg font-medium ${quest.completed ? 'line-through text-gray-400' : ''}">
              <span>${quest.emoji}</span>
              <span>${quest.title}</span>
            </div>
            <p class="text-sm text-gray-400">Due: <span class="${dueClass} font-semibold">${dueText}</span></p>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <span class="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">+${quest.xp} XP</span>
          <button class="edit-btn text-xs text-gray-500 hover:underline" data-id="${quest.id}">Edit</button>
          <button class="delete-btn text-xs text-red-500 hover:underline" data-id="${quest.id}">Delete</button>
        </div>
      `;

      questsContainer.appendChild(questEl);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.dataset.id);
        const quest = quests.find(q => q.id === id);
        if (quest && quest.completed) {
          totalXP = Math.max(0, totalXP - quest.xp);
          localStorage.setItem('studyquest-xp', totalXP);
          updateXPDisplay();
        }
        quests = quests.filter(q => q.id !== id);
        saveQuests();
        renderQuests();
      });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const questId = parseInt(e.target.getAttribute('data-id'));
        const quest = quests.find((q) => q.id === questId);

        if (quest) {
          if (e.target.checked && !quest.completed) {
            totalXP += quest.xp;
          } else if (!e.target.checked && quest.completed) {
            totalXP = Math.max(0, totalXP - quest.xp);
          }

          quest.completed = e.target.checked;
          localStorage.setItem('studyquest-xp', totalXP);
          updateXPDisplay();
          saveQuests();
          renderQuests();
        }
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.dataset.id);
        const quest = quests.find(q => q.id === id);

        if (quest) {
          document.getElementById('editQuestId').value = quest.id;
          document.getElementById('editQuestTitle').value = quest.title;
          document.getElementById('editQuestEmoji').value = quest.emoji;
          document.getElementById('editQuestDue').value = quest.due;
          document.getElementById('editQuestXP').value = quest.xp;

          document.getElementById('editModal').classList.remove('hidden');
        }
      });
    });
  }

  renderQuests();

  document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
  });

  document.getElementById('editQuestForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById('editQuestId').value);
    const title = document.getElementById('editQuestTitle').value.trim();
    const emoji = document.getElementById('editQuestEmoji').value.trim();
    const due = document.getElementById('editQuestDue').value;
    const xp = parseInt(document.getElementById('editQuestXP').value);

    const quest = quests.find(q => q.id === id);
    if (quest) {
      quest.title = title;
      quest.emoji = emoji;
      quest.due = due;
      quest.xp = xp;

      saveQuests();
      renderQuests();
      document.getElementById('editModal').classList.add('hidden');
    }
  });

  const questForm = document.getElementById('questForm');
  if (questForm) {
    questForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = document.getElementById('questTitle').value.trim();
      const emoji = document.getElementById('questEmoji').value.trim() || '🗒️';
      const xp = parseInt(document.getElementById('questXP').value.trim());
      const due = document.getElementById('questDue').value.trim();

      const dueDate = new Date(due);
      const now = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(now.getFullYear() + 2); // e.g., allow up to 2 years in future

      // ✅ New Validations
      if (
        !title ||
        isNaN(xp) ||
        !due ||
        isNaN(dueDate.getTime()) || // Invalid date
        dueDate < now ||            // Date is in the past
        dueDate > maxDate           // Too far in the future
      ) {
        alert('Please enter valid quest details. Date must be within the next 2 years.');
        return;
      }

      const newQuest = {
        id: Date.now(),
        title,
        emoji,
        xp,
        due,
        completed: false
      };

      quests.push(newQuest);
      saveQuests();
      renderQuests();
      questForm.reset();
      questModal.classList.add('hidden');
    });
  }

    // Create Quest Modal Logic
    const openQuestModal = document.getElementById('openQuestModal');
    const questModal = document.getElementById('questModal');
    const cancelQuest = document.getElementById('cancelQuest');

    if (openQuestModal && questModal && cancelQuest && questForm) {
      openQuestModal.addEventListener('click', () => {
        questModal.classList.remove('hidden');
      });

      cancelQuest.addEventListener('click', () => {
        questModal.classList.add('hidden');
      });

      questForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('questTitle').value.trim();
        const emoji = document.getElementById('questEmoji').value.trim() || '🗒️';
        const xp = parseInt(document.getElementById('questXP').value.trim());
        const due = document.getElementById('questDue').value.trim();
        const dueColor = getDueColor(due);

        if (!title || isNaN(xp) || !due) return;

        const newQuest = {
          id: Date.now(),
          title,
          emoji,
          xp,
          due,
          completed: false,
          dueColor
        };

        quests.push(newQuest);
        saveQuests();
        renderQuests();
        questForm.reset();
        questModal.classList.add('hidden');
      });
    }

    //Emoji function
    function setupEmojiPicker(buttonId, inputId, containerId) {
      const button = document.getElementById(buttonId);
      const input = document.getElementById(inputId);
      const container = document.getElementById(containerId);

      let pickerOpen = false;

      button.addEventListener('click', () => {
        if (pickerOpen) {
          container.classList.add('hidden');
          pickerOpen = false;
          return;
        }

        const picker = new EmojiMart.Picker({
          onEmojiSelect: (emoji) => {
            input.value = emoji.native;
            container.classList.add('hidden');
            pickerOpen = false;
          },
          theme: 'light'
        });

        container.innerHTML = '';
        container.appendChild(picker);
        container.classList.remove('hidden');
        pickerOpen = true;
      });
    }
    setupEmojiPicker('emoji-button', 'questEmoji', 'emoji-picker-container');
    setupEmojiPicker('edit-emoji-button', 'editQuestEmoji', 'edit-emoji-picker-container');
});

