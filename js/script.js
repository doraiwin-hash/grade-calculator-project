// In-memory list of task objects, persisted to localStorage
const STORAGE_KEY = "todoTasks";
let tasks = loadTasks();
let currentFilter = "all";
let currentSort = "created";
let nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

// Form fields
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDescInput = document.getElementById("taskDescInput");
const taskPriorityInput = document.getElementById("taskPriorityInput");
const taskDueInput = document.getElementById("taskDueInput");
const taskCategoryInput = document.getElementById("taskCategoryInput");

// Display elements
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskSummary = document.getElementById("taskSummary");
const statusFilterGroup = document.getElementById("statusFilterGroup");
const sortSelect = document.getElementById("sortSelect");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

statusFilterGroup.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter]");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  [...statusFilterGroup.children].forEach((b) => b.classList.toggle("active", b === btn));
  render();
});

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  render();
});

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const title = taskInput.value.trim();
  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  tasks.push({
    id: nextId++,
    title,
    description: taskDescInput.value.trim(),
    priority: taskPriorityInput.value,
    dueDate: taskDueInput.value,
    category: taskCategoryInput.value.trim(),
    completed: false,
    createdAt: Date.now(),
  });

  saveTasks();
  taskForm.reset();
  taskPriorityInput.value = "medium";
  render();
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function updateTask(id, updates) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    Object.assign(task, updates);
    saveTasks();
    render();
  }
}

function getVisibleTasks() {
  let visible = tasks.filter((t) => {
    if (currentFilter === "pending") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  const priorityRank = { high: 0, medium: 1, low: 2 };
  visible = [...visible].sort((a, b) => {
    if (currentSort === "due") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (currentSort === "priority") {
      return priorityRank[a.priority] - priorityRank[b.priority];
    }
    return b.createdAt - a.createdAt;
  });

  return visible;
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

function render() {
  taskList.innerHTML = "";
  const visible = getVisibleTasks();

  visible.forEach((task) => taskList.appendChild(buildTaskElement(task)));

  emptyMessage.style.display = visible.length === 0 ? "block" : "none";
  emptyMessage.textContent = tasks.length === 0
    ? "No tasks yet. Add one above!"
    : "No tasks match this filter.";

  const completedCount = tasks.filter((t) => t.completed).length;
  taskSummary.textContent = tasks.length === 0
    ? ""
    : `${completedCount} of ${tasks.length} task${tasks.length === 1 ? "" : "s"} completed`;
}

function buildTaskElement(task) {
  const li = document.createElement("li");
  li.className = "list-group-item";

  const header = document.createElement("div");
  header.className = "task-header";

  const title = document.createElement("span");
  title.className = "task-text" + (task.completed ? " completed" : "");
  title.textContent = task.title;
  // Clicking the title toggles it as completed (strike-through)
  title.addEventListener("click", () => toggleComplete(task.id));
  header.appendChild(title);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-outline-secondary btn-sm";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => renderEditForm(li, task));
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-outline-danger btn-sm delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));
  actions.appendChild(deleteBtn);

  header.appendChild(actions);
  li.appendChild(header);

  if (task.description) {
    const desc = document.createElement("p");
    desc.className = "task-desc mb-0" + (task.completed ? " completed" : "");
    desc.textContent = task.description;
    li.appendChild(desc);
  }

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `badge priority-badge priority-${task.priority}`;
  priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + " priority";
  meta.appendChild(priorityBadge);

  if (task.dueDate) {
    const dueBadge = document.createElement("span");
    dueBadge.className = "badge bg-light text-dark due-badge" + (isOverdue(task) ? " overdue" : "");
    dueBadge.textContent = (isOverdue(task) ? "Overdue: " : "Due: ") + task.dueDate;
    meta.appendChild(dueBadge);
  }

  if (task.category) {
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge bg-secondary";
    categoryBadge.textContent = task.category;
    meta.appendChild(categoryBadge);
  }

  const statusBadge = document.createElement("span");
  statusBadge.className = "badge " + (task.completed ? "bg-success" : "bg-info text-dark");
  statusBadge.textContent = task.completed ? "Completed" : "Pending";
  meta.appendChild(statusBadge);

  li.appendChild(meta);

  return li;
}

function renderEditForm(li, task) {
  li.innerHTML = "";
  li.classList.add("edit-form");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "form-control";
  titleInput.value = task.title;

  const descInput = document.createElement("textarea");
  descInput.className = "form-control";
  descInput.rows = 2;
  descInput.value = task.description;

  const row = document.createElement("div");
  row.className = "row g-2 mb-2";

  const priorityCol = document.createElement("div");
  priorityCol.className = "col-4";
  const priorityInput = document.createElement("select");
  priorityInput.className = "form-select";
  ["low", "medium", "high"].forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
    if (p === task.priority) opt.selected = true;
    priorityInput.appendChild(opt);
  });
  priorityCol.appendChild(priorityInput);

  const dueCol = document.createElement("div");
  dueCol.className = "col-4";
  const dueInput = document.createElement("input");
  dueInput.type = "date";
  dueInput.className = "form-control";
  dueInput.value = task.dueDate;
  dueCol.appendChild(dueInput);

  const categoryCol = document.createElement("div");
  categoryCol.className = "col-4";
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.className = "form-control";
  categoryInput.value = task.category;
  categoryCol.appendChild(categoryInput);

  row.append(priorityCol, dueCol, categoryCol);

  const actions = document.createElement("div");
  actions.className = "d-flex gap-2";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn btn-primary btn-sm";
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (title === "") {
      alert("Task title cannot be empty.");
      return;
    }
    updateTask(task.id, {
      title,
      description: descInput.value.trim(),
      priority: priorityInput.value,
      dueDate: dueInput.value,
      category: categoryInput.value.trim(),
    });
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-outline-secondary btn-sm";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", render);

  actions.append(saveBtn, cancelBtn);

  li.append(titleInput, descInput, row, actions);
}

render();
