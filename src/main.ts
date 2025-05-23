import './output.css';

const addTaskBtn = document.getElementById("open-task-form-btn") as HTMLButtonElement;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descField = document.getElementById("description") as HTMLTextAreaElement;
const statusOpt = document.getElementById("status") as HTMLSelectElement;
const priorityOpt = document.getElementById("priority") as HTMLSelectElement;
const addedOrUpdatedTaskBtn = document.getElementById("addNewTask-btn") as HTMLButtonElement;
const tasksContainer = document.getElementById("tasks-container") as HTMLDivElement;
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
        status: statusOpt.value,
        priority: priorityOpt.value,
    };

    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer(); 
    //resetTask();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  // loop through the taskData array and add the tasks to the DOM
  taskData.forEach(({ id, title, description, status, priority }: any) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <button onclick="${editTask(this)}" type="button" class="btn">Edit</button>
          <button onclick="${deleteTask(this)}" type="button" class="btn">Delete</button>
        </div>
      `;
  });
};

const editTask = (buttonEl: any) => {
    const dataArrIndex = taskData.findIndex(
        (item: any) => item.id === buttonEl.parentElement.id
    );

    trackCurrentTask = taskData[dataArrIndex];

    titleInput.value = trackCurrentTask.title;
    descField.value = trackCurrentTask.description;
    statusOpt.value = trackCurrentTask.status;
    priorityOpt.value = trackCurrentTask.priority;

    addedOrUpdatedTaskBtn.innerText = "Update Task";

    taskForm.classList.toggle("hidden");
};

const deleteTask = (buttonEL: any) => {
    const dataArrIndex = taskData.findIndex(
        (item: any) => item.id === buttonEL.parentElement.id
    );
    
    buttonEL.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data", JSON.stringify(taskData));
};


taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask();
});

addTaskBtn.addEventListener("click", () => {
    taskForm.classList.toggle("hidden");
});
