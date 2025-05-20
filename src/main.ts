import './output.css';

const addTaskBtn = document.getElementById("task-btn") as HTMLButtonElement;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const inputTitle = document.getElementById("title") as HTMLInputElement;
const descField = document.getElementById("description") as HTMLTextAreaElement;
const statusOpt = document.getElementById("status") as HTMLSelectElement;
const priorityOpt = document.getElementById("priority") as HTMLSelectElement;
const addedTaskBtn = document.getElementById("addNewTask-btn") as HTMLButtonElement;
const todoTaskDiv = document.getElementById("todo-tasks") as HTMLDivElement;
const inPorgressTaskDiv = document.getElementById("in-progress-tasks") as HTMLDivElement;
const doneTaskDiv = document.getElementById("done-tasks") as HTMLDivElement;

