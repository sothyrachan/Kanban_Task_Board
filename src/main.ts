import "./output.css";
import { removeSpecialChars, generateTaskId } from "./utils";

enum Status {
    Todo = "todo",
    InProgress = "in-progress",
    Done = "done",
}

enum Priority {
    Low = "low",
    Medium = "medium",
    High = "high",
}

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
        submit: document.getElementById("add-new-task-btn") as HTMLButtonElement,
        cancelDialog: document.getElementById("cancel-dialog-btn") as HTMLButtonElement,
        discardDialog: document.getElementById("discard-dialog-btn") as HTMLButtonElement,
    },
    form: document.getElementById("task-form") as HTMLFormElement,
    inputs: {
        title: document.getElementById("title") as HTMLInputElement,
        description: document.getElementById("description") as HTMLTextAreaElement,
        status: document.getElementById("status") as HTMLSelectElement,
        priority: document.getElementById("priority") as HTMLSelectElement,
    },
    dialogMessage: {
        confirmCloseDialog: document.getElementById("confirm-close-dialog") as HTMLDialogElement,
        errorInputMsgBox: document.getElementById("error-dialog") as HTMLDialogElement,
        errorInputMsg: document.getElementById("error-dialog-message") as HTMLElement,
    },
    dialogFunctions: {
        onCloseFormClick: () => dom.dialogMessage.confirmCloseDialog.showModal(),
        onCancelDialogClick: () => {
            dom.dialogMessage.confirmCloseDialog.showModal();
        },
        onDiscardDialogClick: () => {
            resetTask();
            dom.dialogMessage.confirmCloseDialog.close();
        },
    },
    containers: {
        todo: document.getElementById("todo-tasks") as HTMLDivElement,
        inProgress: document.getElementById("in-progress-tasks") as HTMLDivElement,
        done: document.getElementById("done-tasks") as HTMLDivElement,
    },
};

let taskData: Task[] = JSON.parse(localStorage.getItem("data") || "[]");
let trackCurrentTask: Task | null = null;

const saveTasksToStorage = () =>
    localStorage.setItem("data", JSON.stringify(taskData));

const getTaskElementHTML = (task: Task) => `
    <p class="text-sm"><strong>Title:</strong> ${task.title}</p>
    <p class="text-sm"><strong>Description:</strong> ${task.description}</p>
    <p class="text-sm"><strong>Status:</strong> ${task.status}</p>
    <p class="text-sm"><strong>Priority:</strong> ${task.priority}</p>
    <div class="mt-2 flex gap-2">
      <button type="button" class="btn btn-edit">Edit</button>
      <button type="button" class="btn btn-delete">Delete</button>
    </div>
`;

const addOrUpdateTask = () => {
    const { title, description, status, priority } = dom.inputs;

    if (!title.value.trim()) return showErrorDialog("Please input the Task Title!");
    if (!status.value) return showErrorDialog("Please select the Status Option!");
    if (!priority.value) return showErrorDialog("Please select the Priority Option!");

    const dataArrIndex = taskData.findIndex(
        (task) => task.id === trackCurrentTask?.id
    );
    const newTask: Task = {
        id: generateTaskId(title.value),
        title: removeSpecialChars(title.value),
        description: removeSpecialChars(description.value),
        status: status.value as Status,
        priority: priority.value as Priority,
    };

    if (dataArrIndex === -1) {
        taskData.unshift(newTask);
    } else {
        taskData[dataArrIndex] = newTask;
    }

    saveTasksToStorage();
    updateTaskContainer();
    resetTask();
};

const showErrorDialog = (message: string) => {
    if (dom.dialogMessage.errorInputMsg) {
        dom.dialogMessage.errorInputMsg.textContent = message;
        dom.dialogMessage.errorInputMsgBox.showModal();
    }
};

const updateTaskContainer = () => {
    Object.values(dom.containers).forEach(
        (container) => (container.innerHTML = "")
    );

    taskData.forEach((task) => {
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
            case Status.Todo:
                dom.containers.todo.appendChild(taskEl);
                break;
            case Status.InProgress:
                dom.containers.inProgress.appendChild(taskEl);
                break;
            case Status.Done:
                dom.containers.done.appendChild(taskEl);
                break;
        }
    });

    bindTaskCardActions();
};

const bindTaskCardActions = () => {
    Object.values(dom.containers).forEach((container) => {
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
};

const closeDialog = () => {
    dom.buttons.cancelDialog.addEventListener("click", dom.dialogFunctions.onCancelDialogClick);
    dom.buttons.discardDialog.addEventListener("click", dom.dialogFunctions.onDiscardDialogClick);
};

const editedForm = (): boolean => {
    if (!trackCurrentTask) return false;

    return (
        removeSpecialChars(dom.inputs.title.value) !== trackCurrentTask.title ||
        removeSpecialChars(dom.inputs.description.value) !== trackCurrentTask.description ||
        dom.inputs.status.value !== trackCurrentTask.status ||
        dom.inputs.priority.value !== trackCurrentTask.priority
    );
}

const editTask = (taskId: string) => {
    const task = taskData.find((task) => task.id === taskId);
    if (!task) return;

    trackCurrentTask = task;

    dom.inputs.title.value = task.title;
    dom.inputs.description.value = task.description;
    dom.inputs.status.value = task.status;
    dom.inputs.priority.value = task.priority;

    dom.buttons.submit.innerText = "Update Task";
    dom.form.classList.remove("hidden");
};

const deleteTask = (taskId: string) => {
    taskData = taskData.filter((task) => task.id !== taskId);
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
    dom.form.classList.add("hidden");
};

const updateTaskStatus = (taskId: string, newStatus: string) => {
    if (!Object.values(Status).includes(newStatus as Status)) return;

    const task = taskData.find((task) => task.id === taskId);
    if (task) {
        task.status = newStatus as Status;
        saveTasksToStorage();
    }
};

const initializeDragAndDrop = () => {
    Object.values(dom.containers).forEach((container) => {
        container.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add("drag-over");
        });

        container.addEventListener("dragleave", () => {
            container.classList.remove("drag-over");
        });

        container.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            container.classList.remove("drag-over");

            const taskId = e.dataTransfer?.getData("text/plain");
            const newStatus = container.id.replace("-tasks", "") as Status;

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
        if (editedForm()) {
            dom.dialogFunctions.onCloseFormClick();
        } else {
            resetTask();
            dom.form.classList.add("hidden");
        }
    });
};

const init = () => {
    updateTaskContainer();
    initializeDragAndDrop();
    bindUIEvents();
    closeDialog();
};

document.addEventListener("DOMContentLoaded", init);