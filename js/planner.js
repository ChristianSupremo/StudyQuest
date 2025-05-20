document.addEventListener('DOMContentLoaded', () => {
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskModal = document.getElementById('task-modal');
  const taskList = document.querySelector('ul.space-y-3');
  const saveBtn = taskModal.querySelector('button.bg-blue-600');
  const taskNameInput = taskModal.querySelector('input[type="text"]');
  const taskDateInput = taskModal.querySelector('input[type="date"]');
  const weekContainer = document.getElementById('weekly-overview-days');
  const weekLabel = document.getElementById('current-week-label');
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let editingIndex = null; // For edit mode
  let currentWeekStart = getStartOfWeek(new Date());

  renderTasks();
  renderWeek();

  addTaskBtn.addEventListener('click', () => {
    editingIndex = null;
    taskModal.classList.remove('hidden');
    taskNameInput.value = '';
    taskDateInput.value = '';
  });

  saveBtn.addEventListener('click', () => {
    const taskName = taskNameInput.value.trim();
    const dueDate = taskDateInput.value;

    if (!taskName || !dueDate) {
      alert('Please enter both a task name and a due date.');
      return;
    }

    if (editingIndex !== null) {
      tasks[editingIndex] = { name: taskName, date: dueDate };
    } else {
      tasks.push({ name: taskName, date: dueDate });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    renderWeek();
    taskModal.classList.add('hidden');
  });

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm';

      li.innerHTML = `
        <div>
          <p class="font-medium">${task.name}</p>
          <p class="text-xs text-gray-500">Due: ${new Date(task.date).toLocaleDateString()}</p>
        </div>
        <div class="flex gap-2">
          <button class="edit-btn bg-yellow-400 text-white hover:bg-yellow-500 text-lg p-2 rounded" title="Edit Task">✏️</button>
          <button class="delete-btn bg-red-500 text-white hover:bg-red-600 text-lg p-2 rounded" title="Delete Task">🗑️</button>
        </div>
      `;

      li.querySelector('.delete-btn').addEventListener('click', () => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        renderWeek();
      });

      li.querySelector('.edit-btn').addEventListener('click', () => {
        editingIndex = index;
        taskModal.classList.remove('hidden');
        taskNameInput.value = task.name;
        taskDateInput.value = task.date;
      });

      taskList.appendChild(li);
    });
  }

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatDateKey(date) {
    return date.toISOString().split("T")[0];
  }

  function renderWeek() {
    weekContainer.innerHTML = "";
    const startOfWeek = new Date(currentWeekStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const isToday = day.toDateString() === today.toDateString();
      const dateKey = formatDateKey(day);

      const div = document.createElement("div");
      div.className = `p-2 rounded-xl min-h-[100px] flex flex-col items-center text-sm gap-1 ${
        isToday ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
      }`;

      const dateNum = document.createElement("span");
      dateNum.className = "font-bold";
      dateNum.textContent = day.getDate();
      div.appendChild(dateNum);

      tasks.filter(task => task.date === dateKey).forEach(task => {
        const taskBubble = document.createElement("div");
        taskBubble.className = "text-xs bg-white text-blue-700 px-2 py-1 rounded shadow-sm text-center w-full";
        taskBubble.textContent = task.name;
        div.appendChild(taskBubble);
      });

      weekContainer.appendChild(div);
    }
  }

  prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeek();
  });

  nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeek();
  });
});
