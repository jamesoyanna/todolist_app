const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'}`;
}

function createTaskElement(taskText, completed = false, id) {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item' + (completed ? ' completed' : '');
  taskItem.dataset.id = id;

  taskItem.innerHTML = `
    <div class="checkbox ${completed ? 'checked' : ''}"></div>
    <span class="task-text">${taskText}</span>
    <button class="delete-btn">×</button>
  `;

  // Toggle completion
  taskItem.querySelector('.checkbox').addEventListener('click', () => {
    taskItem.classList.toggle('completed');
    const checkbox = taskItem.querySelector('.checkbox');
    checkbox.classList.toggle('checked');
    
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    updateTaskCount();
  });

  // Delete task
  taskItem.querySelector('.delete-btn').addEventListener('click', () => {
    taskItem.style.animation = 'slideIn 0.3s reverse';
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }, 200);
  });

  return taskItem;
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  taskInput.value = '';
  
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>All done!</p>
        <p>No tasks yet. Add one above!</p>
      </div>
    `;
    updateTaskCount();
    return;
  }

  tasks.forEach(task => {
    const taskElement = createTaskElement(task.text, task.completed, task.id);
    taskList.appendChild(taskElement);
  });

  updateTaskCount();
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Initial render
renderTasks();