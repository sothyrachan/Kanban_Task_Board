import './output.css';

const addTaskBtn = document.getElementById("open-task-form-btn") as HTMLButtonElement;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const closeAddTaskFormBtn = document.getElementById("close-form-btn") as HTMLButtonElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descField = document.getElementById("description") as HTMLTextAreaElement;
const statusOpt = document.getElementById("status") as HTMLSelectElement;
const priorityOpt = document.getElementById("priority") as HTMLSelectElement;
const addedOrUpdatedTaskBtn = document.getElementById("add-new-task-btn") as HTMLButtonElement;
const todoTaskDiv = document.getElementById("todo-tasks") as HTMLDivElement;
const inProgressTaskDiv = document.getElementById("in-progress-tasks") as HTMLDivElement;
const doneTaskDiv = document.getElementById("done-tasks") as HTMLDivElement;


let taskData: Task[] = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data") as string) : [];

let trackCurrentTask: Task | null = null;

const removeSpecialChars = (value: string) => {
    return value.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
}

const addOrUpdateTask = () => {
    if (!titleInput.value.trim()) return alert("Please input the task title!");

    const dataArrIndex = taskData.findIndex((item: any) => item.id === trackCurrentTask?.id)

    const taskObj: Task = {
        id: `${removeSpecialChars(titleInput.value)
            .toLowerCase()
            .split(" ")
            .join("-")}-${Date.now()}`,
        title: removeSpecialChars(titleInput.value),
        description: removeSpecialChars(descField.value),
        status: statusOpt.value as 'todo' | 'in-progress' | 'done',
        priority: priorityOpt.value as 'low' | 'medium' | 'high',
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer();
    resetTask();
};

const updateTaskContainer = () => {
    todoTaskDiv.innerHTML = "";
    inProgressTaskDiv.innerHTML = "";
    doneTaskDiv.innerHTML = "";

    // loop through the taskData array and add the tasks to the DOM
    taskData.forEach(({ id, title, description, status, priority }: any) => {
        const taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.id = id;
        taskEl.draggable = true;

        taskEl.innerHTML = `
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <button type="button" class="btn">Edit</button>
          <button type="button" class="btn">Delete</button>
      `;

        taskEl.addEventListener("dragstart", (e) => {
            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", taskEl.id);
                e.dataTransfer.effectAllowed = "move";
            }
        });

        switch (status) {
            case "todo":
                todoTaskDiv.appendChild(taskEl);
                break;
            case "in-progress":
                inProgressTaskDiv.appendChild(taskEl);
                break;
            case "done":
                doneTaskDiv.appendChild(taskEl);
                break;
            default:
                todoTaskDiv.appendChild(taskEl);
        }
    });

    checkEditOrDeleteBtn();
};

const initializeDragAndDrop = () => {
    [todoTaskDiv, inProgressTaskDiv, doneTaskDiv].forEach((container) => {
        // Allow drop
        container.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
        });

        // Handle drop
        container.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            
            const taskId = e.dataTransfer?.getData("text/plain");
            
            // container is the div on which drop event is fired, so get status from it
            const targetColumn = container.id === 'todo-tasks' ? 'todo' :
                                 container.id === 'in-progress-tasks' ? 'in-progress' :
                                 container.id === 'done-tasks' ? 'done' : null;

            if (taskId && targetColumn) {
                updateTaskStatus(taskId, targetColumn);
                updateTaskContainer(); // Refresh all containers
            }
        })
    })
}

const checkEditOrDeleteBtn = () => {
    [todoTaskDiv, inProgressTaskDiv, doneTaskDiv].forEach(eachTaskDivContainer => {
        eachTaskDivContainer.addEventListener("click", (e) => {
            const targetBtn = e.target as HTMLButtonElement;

            if (targetBtn.matches(".btn")) {
                if (targetBtn.textContent === "Edit") {
                    editTask(targetBtn);
                } else if (targetBtn.textContent === "Delete") {
                    deleteTask(targetBtn);
                }
            }
        })
    });
}

const editTask = (buttonEl: HTMLButtonElement) => {
    const dataArrIndex = taskData.findIndex(
        (item: any) => item.id === buttonEl.parentElement?.id
    );

    trackCurrentTask = taskData[dataArrIndex];

    titleInput.value = trackCurrentTask.title;
    descField.value = trackCurrentTask.description;
    statusOpt.value = trackCurrentTask.status;
    priorityOpt.value = trackCurrentTask.priority;

    addedOrUpdatedTaskBtn.innerText = "Update Task";

    taskForm.classList.toggle("hidden");
};

const deleteTask = (buttonEL: HTMLButtonElement) => {
    const dataArrIndex = taskData.findIndex(
        (item: any) => item.id === buttonEL.parentElement?.id
    );

    buttonEL.parentElement?.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data", JSON.stringify(taskData));
};

const resetTask = () => {
    addedOrUpdatedTaskBtn.innerText = "Add Task";
    titleInput.value = "";
    descField.value = "";
    statusOpt.value = "";
    priorityOpt.value = "";
    trackCurrentTask = null;
    taskForm.classList.toggle("hidden");
};

function updateTaskStatus(taskId: string, newStatus: string) {
    if (!['todo', 'in-progress', 'done'].includes(newStatus)) {
        console.error('Invalid status:', newStatus);
        return;
    }
    const taskIndex = taskData.findIndex((task: any) => task.id === taskId);
    if (taskIndex !== -1) {
        taskData[taskIndex].status = newStatus as 'todo' | 'in-progress' | 'done';
        localStorage.setItem("data", JSON.stringify(taskData));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (taskData.length > 0) {
        updateTaskContainer();
    }
    initializeDragAndDrop();
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask(); 
});

addTaskBtn.addEventListener("click", () => {
    taskForm.classList.toggle("hidden");
});

closeAddTaskFormBtn.addEventListener("click", () => {
    taskForm.classList.add("hidden");
});