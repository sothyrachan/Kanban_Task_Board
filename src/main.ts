import './output.css';

const addTaskBtn = document.getElementById("open-task-form-btn") as HTMLButtonElement;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descField = document.getElementById("description") as HTMLTextAreaElement;
const statusOpt = document.getElementById("status") as HTMLSelectElement;
const priorityOpt = document.getElementById("priority") as HTMLSelectElement;
const addedTaskBtn = document.getElementById("addNewTask-btn") as HTMLButtonElement;
const todoTaskDiv = document.getElementById("todo-tasks") as HTMLDivElement;
const inPorgressTaskDiv = document.getElementById("in-progress-tasks") as HTMLDivElement;
const doneTaskDiv = document.getElementById("done-tasks") as HTMLDivElement;

const taskData = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data") as string) : [];

let trackCurrentTask: any = {};

const removeSpecialChars = (value: string) => {
    return value.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

const addOrUpdateTask = () => {
    if (!titleInput.value.trim()) return alert("Please input the task title!");

    const dataArrIndex = taskData.findIndex((item: any) => item.id === trackCurrentTask.id)
    
    const taskObj: any = {
        id: `${removeSpecialChars(titleInput.value)
            .toLowerCase()
            .split(" ")
            .join("-")}-${Date.now()}`,
        title: removeSpecialChars(titleInput.value),
        description: removeSpecialChars(descField.value),
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData)); 
};

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask();
});

addTaskBtn.addEventListener("click", () => {
    taskForm.classList.toggle("hidden");
});
