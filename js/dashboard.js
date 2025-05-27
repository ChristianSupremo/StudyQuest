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



  // --- Quest System (Using Fetch + PHP Backend) ---
  const questList = document.querySelector('.grid.gap-4');
  let quests = [];

 function loadQuests() {
  fetch('php/quests.php')
    .then(res => res.json())
    .then(data => {
      quests = data;
      console.log("Loaded quests:", data);
      renderQuests();
      attachQuestEventListeners();
    })
    .catch(err => console.error('Error loading quests:', err));
}


  function getTimeRemaining(dueDateStr) {
    const dueDate = new Date(dueDateStr);
    if (isNaN(dueDate)) return { text: dueDateStr, class: 'text-gray-400' };
    const now = new Date();
    const diff = dueDate - now;
    if (diff <= 0) return { text: 'Overdue', class: 'text-red-500' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    let dueClass = 'text-indigo-500';
    if (days < 1) dueClass = 'text-red-500';
    else if (days === 1) dueClass = 'text-yellow-500';
    return { text: `Due in ${days}d ${hours}h ${minutes}m`, class: dueClass };
  }

function renderQuests() {
  const questList = document.getElementById("questList");
  questList.innerHTML = ""; // clear old quests

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
          <button class="edit-btn text-gray-500 hover:text-blue-600" data-id="${quest.id}" title="Edit">✏️</button>
          <button class="delete-btn text-red-500 hover:text-red-700" data-id="${quest.id}" title="Delete">🗑️</button>
      </div>`;
    
    questList.appendChild(questEl);
  });

  // Attach checkbox listeners AFTER rendering
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const questId = parseInt(e.target.getAttribute('data-id'));
      const quest = quests.find(q => q.id === questId);
      if (!quest) return;

      const wasCompleted = quest.completed;
      quest.completed = e.target.checked;

      if (quest.completed && !wasCompleted) {
        totalXP += quest.xp;
      } else if (!quest.completed && wasCompleted) {
        totalXP = Math.max(0, totalXP - quest.xp);
      }

      updateXPDisplay();

      // Sync with database
      fetch(`php/quests.php?id=${quest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: quest.completed })
      }).catch(err => console.error('Toggle complete failed:', err));

      // Optional: visually refresh only this quest row instead of full render
    });
  });
  attachQuestEventListeners();
}

function attachQuestEventListeners() {
  // First, remove existing listeners by cloning the buttons (clean way to reset)
  document.querySelectorAll('.edit-btn').forEach(button => {
    const newButton = button.cloneNode(true); // Clone without events
    button.parentNode.replaceChild(newButton, button); // Replace old with clean one
  });

  // Now add listeners to clean buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      console.log("Edit button clicked"); // ⬅️ Add this
      const id = parseInt(e.currentTarget.dataset.id);
      const quest = quests.find(q => q.id === id);
      if (!quest) return;

      const editModal = document.getElementById('editModal');
      console.log("Modal element:", editModal);
      if (!editModal) return;
      editModal.classList.remove('hidden');

      // Fill modal fields
      document.getElementById('editQuestId').value = quest.id;
      document.getElementById('editQuestTitle').value = quest.title;
      document.getElementById('editQuestEmoji').value = quest.emoji;
      document.getElementById('editQuestDue').value = quest.due;
      document.getElementById('editQuestXP').value = quest.xp;

      // Show modal
      console.log("Opening modal for quest ID:", quest.id);
      editModal.classList.remove('hidden');
    });
  });

    // Delete button logic
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      fetch(`php/quests.php?id=${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          quests = quests.filter(q => q.id !== id);
          renderQuests();
          attachQuestEventListeners();
          showMessage('Quest deleted successfully.');
        })
        .catch(err => {
          console.error(err);
          showMessage('Failed to delete quest.', 'error');
        });
    });
  });
  console.log("Reattaching event listeners to edit buttons");
}

document.getElementById('editQuestForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('editQuestId').value);
  const quest = {
    id,
    title: document.getElementById('editQuestTitle').value.trim(),
    emoji: document.getElementById('editQuestEmoji').value.trim(),
    due: document.getElementById('editQuestDue').value,
    xp: parseInt(document.getElementById('editQuestXP').value)
  };

  fetch(`php/quests.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quest)
  })
    .then(res => {
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    })
    .then(() => {
      loadQuests();
      document.getElementById('editModal').classList.add('hidden');
      showMessage('Quest updated successfully.');
    })
    .catch(err => {
      console.error(err);
      showMessage('Failed to update quest.', 'error');
    });
});


loadQuests();
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
      maxDate.setFullYear(now.getFullYear() + 2);
      if (!title || isNaN(xp) || !due || isNaN(dueDate.getTime()) || dueDate < now || dueDate > maxDate) {
        alert('Please enter valid quest details.');
        return;
      }
      const newQuest = { title, emoji, xp, due };
      fetch('php/quests.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuest)
      })
        .then(res => res.json())
        .then(savedQuest => {
          quests.push(savedQuest);
          renderQuests();
          attachQuestEventListeners(); // <-- THIS is the key fix
          questForm.reset();
          questModal.classList.add('hidden');
        })
        .catch(err => console.error('Add quest failed:', err));
    });
  }

    // Create Quest Modal Logic
    const openQuestModal = document.getElementById('openQuestModal');
    const questModal = document.getElementById('questModal');
    const cancelQuest = document.getElementById('cancelQuest');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editModal = document.getElementById('editModal');

    if (openQuestModal && questModal && cancelQuest && questForm) {
      openQuestModal.addEventListener('click', () => {
        questModal.classList.remove('hidden');
      });

      cancelQuest.addEventListener('click', () => {
        questModal.classList.add('hidden');
      });

      if (cancelEditBtn && editModal) {
        cancelEditBtn.addEventListener('click', () => {
          editModal.classList.add('hidden');
        });
      }
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

    //Emoji only field
    function restrictToEmojiOnly(inputId, maxLength = 2) {
      const input = document.getElementById(inputId);
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        const emojiOnly = [...value].filter(char => /\p{Extended_Pictographic}/u.test(char)).join('');
        e.target.value = emojiOnly.slice(0, maxLength);
      });
    }

    // Apply to both fields
    restrictToEmojiOnly('questEmoji');
    restrictToEmojiOnly('editQuestEmoji');

  function showMessage(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white text-sm z-50 transition-all duration-300 ease-in-out
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }


});

