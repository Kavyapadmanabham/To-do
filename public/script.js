const API_URL = "https://friendly-halibut-979x9v54v45v2p6gr-5000.app.github.dev/api/tasks";

async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");

        const createdAt = task.createdAt ? new Date(task.createdAt) : new Date();
        const formattedTime = createdAt.toLocaleString();

        li.innerHTML = `
            <div class="task-container">
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask('${task._id}', this.checked)">
                <span class="task-text ${task.completed ? "completed" : ""}">${task.name}</span>
                <span class="timestamp">🕒 ${formattedTime}</span> 
            </div>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
        `;

        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task === "") {
        alert("Task cannot be empty!");
        return;
    }

    const newTask = { name: task, createdAt: new Date().toISOString() };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
    });

    taskInput.value = "";
    loadTasks();
}

async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
    });

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTasks();
}

// Call loadTasks when page loads
loadTasks();

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});
