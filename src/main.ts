import './output.css';

type Status = "todo" | "inProgress" | "done";

type Priority = "low" | "medium" | "high";

interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
}

const dom = {
    buttons: {
        openForm: document.getElementById("open-task-form-btn") as HTMLButtonElement,
        closeForm: document.getElementById("close-form-btn") as HTMLButtonElement,
        submit:  document.getElementById("add-new-task-btn") as HTMLButtonElement,
    },
    form: document.getElementById("task-form") as HTMLFormElement,
    inputs: {
        title: document.getElementById("title") as HTMLInputElement,
        description: document.getElementById("description") as HTMLTextAreaElement,
        status: document.getElementById("status") as HTMLSelectElement,
        priority:  document.getElementById("priority") as HTMLSelectElement,
    },
    containers: {
        todo: document.getElementById("todo-tasks") as HTMLDivElement,
        inProgress: document.getElementById("in-progress-tasks") as HTMLDivElement,
        done: document.getElementById("done-tasks") as HTMLDivElement,
    },
};
 
let taskData: Task[] = JSON.parse(localStorage.getItem("data") || "[]");
let trackCurrentTask: Task | null = null;


const removeSpecialChars = (value: string) => 
    value.trim().replace(/[^A-Za-z0-9\-\s]/g, "");

const generateTaskId = (title: string) => 
    `${removeSpecialChars(title).toLowerCase().split(" ").join("-")}-${Date.now()}`;

const saveTasksToStorage = () => 
    localStorage.setItem("data", JSON.stringify(taskData));

const getTaskElementHTML = (task: Task) => `
    <p><strong>Title:</strong> ${task.title}</p>
    <p><strong>Description:</strong> ${task.description}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <button type="button" class="btn">Edit</button>
    <button type="button" class="btn">Delete</button>
`;

const addOrUpdateTask = () => {
    const { title, description, status, priority } = dom.inputs;

    if (!title.value.trim()) return alert("Please input the task title!");
    if (!status.value) return alert("Please select the status option!");
    if (!priority.value) return alert("Please select the priority option!");

    const dataArrIndex = taskData.findIndex(task => task.id === trackCurrentTask?.id)
    const newTask: Task = {
        id: generateTaskId(title.value),
        title: removeSpecialChars(title.value),
        description: removeSpecialChars(description.value),
        status: status.value as Status,
        priority: priority.value as Priority,
    }

    if (dataArrIndex === -1) {
        taskData.unshift(newTask);
    } else {
        taskData[dataArrIndex] = newTask;
    }

    saveTasksToStorage();
    updateTaskContainer();
    resetTask();
};

const updateTaskContainer = () => {
    Object.values(dom.containers).forEach(container => (container.innerHTML = ""));

    taskData.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.id = task.id;
        taskEl.draggable = true;
        taskEl.setAttribute("data-status", task.status);
        taskEl.innerHTML = getTaskElementHTML(task);

        taskEl.addEventListener("dragstart", (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", taskEl.id);
                e.dataTransfer.effectAllowed = "move";
            }
        });

        switch (task.status) {
            case "todo":
                dom.containers.todo.appendChild(taskEl);
                break;
            case "inProgress":
                dom.containers.inProgress.appendChild(taskEl);
                break;
            case "done":
                dom.containers.done.appendChild(taskEl);
                break;
        }
    });

    bindTaskCardActions();
};

const bindTaskCardActions = () => {
    Object.values(dom.containers).forEach(container => {
        container.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const taskEl = target.closest(".task") as HTMLElement;

            if (!target.matches(".btn") || !taskEl) return;

            if (target.textContent === "Edit") {
                editTask(taskEl.id);
            } else if (target.textContent === "Delete") {
                deleteTask(taskEl.id);
            }
        });
    });
}

const editTask = (taskId: string) => {
    const task = taskData.find(task => task.id === taskId);
    if (!task) return;

    trackCurrentTask = task;

    dom.inputs.title.value = task.title;
    dom.inputs.description.value = task.description;
    dom.inputs.status.value = task.status;
    dom.inputs.priority.value = task.priority;

    dom.buttons.submit.innerText = "Update Task";
    dom.form.classList.toggle("hidden");
};

const deleteTask = (taskId: string) => {
    taskData = taskData.filter(task => task.id !== taskId);
    saveTasksToStorage();
    updateTaskContainer();
};

const resetTask = () => {
    dom.buttons.submit.innerText = "Add Task";
    dom.inputs.title.value = "";
    dom.inputs.description.value = "";
    dom.inputs.status.value = "";
    dom.inputs.priority.value = "";
    trackCurrentTask = null;
    dom.form.classList.toggle("hidden");
};

const updateTaskStatus = (taskId: string, newStatus: string) => {
    const validStatus: Status[] = ["todo", "inProgress", "done"];
    
    if (!validStatus.includes(newStatus as Status)) return;

    const taskIndex = taskData.find(task=> task.id === taskId);
    if (taskIndex) {
        taskIndex.status = newStatus as Status;
        saveTasksToStorage();
    }
}

const initializeDragAndDrop = () => {
    Object.values(dom.containers).forEach((container) => {
        // Allow drop
        container.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add("drag-over");
        });

        container.addEventListener("dragleave", () => {
            container.classList.remove("drag-over");
        });

        // container.addEventListener("dragleave", (e: DragEvent) => {
        //     e.preventDefault();
        //     container.classList.remove("drag-over")
        // });

        // Handle drop
        container.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            container.classList.remove("drag-over");
            
            const taskId = e.dataTransfer?.getData("text/plain");
            const newStatus = container.id.replace("-tasks", '') as Status;

            if (taskId) {
                updateTaskStatus(taskId, newStatus);
                updateTaskContainer();
            }
        });
    });
};

const bindUIEvents = () => {
    dom.form.addEventListener("submit", (e) => {
        e.preventDefault();
        addOrUpdateTask(); 
    });

    dom.buttons.openForm.addEventListener("click", () => {
        dom.form.classList.toggle("hidden");
    });

    dom.buttons.closeForm.addEventListener("click", () => {
        dom.form.classList.add("hidden");
    });
};

const init = () => {
    updateTaskContainer();
    initializeDragAndDrop();
    bindUIEvents();
};

document.addEventListener("DOMContentLoaded", init);