let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categoryInput").value;

  if (!taskInput) return;

  const timestamp = new Date().toLocaleString();
  const task = {
    text: taskInput,
    category,
    timestamp,
    completed: false,
    subtasks: [],
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const search = document.getElementById("searchInput").value.toLowerCase();

  let completedCount = 0;
  tasks.forEach((task, index) => {
    if (!task.text.toLowerCase().includes(search)) return;

    const li = document.createElement("li");
    li.className = `list-group-item ${task.completed ? "completed" : ""}`;

    const taskHtml = `
      <div>
        <strong>${task.text}</strong>
        <small class="text-muted">(${task.category || "No Category"} - ${task.timestamp})</small>
      </div>
      <div class="mt-2">
        <button class="btn btn-sm btn-success me-2" onclick="toggleComplete(${index})">✔️</button>
        <button class="btn btn-sm btn-warning me-2" onclick="editTask(${index})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">🗑️</button>
        <input type="text" placeholder="Add subtask..." class="form-control mt-2"
         onkeypress="if(event.key==='Enter'){addSubtask(${index}, this.value); this.value='';}" />
      </div>`;

    li.innerHTML = taskHtml;

    task.subtasks.forEach(sub => {
      const subLi = document.createElement("li");
      subLi.className = "subtask";
      subLi.innerHTML = `- ${sub}`;
      li.appendChild(subLi);
    });

    taskList.appendChild(li);
    if (task.completed) completedCount++;
  });

  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("completedCount").textContent = completedCount;
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function searchTasks() {
  renderTasks();
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
}

function addSubtask(index, text) {
  if (text.trim()) {
    tasks[index].subtasks.push(text.trim());
    saveTasks();
    renderTasks();
  }
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Initial rendering
renderTasks();
