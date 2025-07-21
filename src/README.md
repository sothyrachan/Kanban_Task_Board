# 📝 Kanban Board App – README

Welcome! This is a simple web app to help you manage your tasks using drag-and-drop. Below is a beginner-friendly explanation of the different parts of the code and what each function does.

---

## 📁 File: `main.ts`

This is the **main file** where the app connects to the webpage (HTML) and makes everything work.

### 🔧 Key Variables

* **`dom`** – Stores references to all the buttons, form inputs, dialog boxes, and task containers on the page.
* **`taskData`** – An array that stores all your tasks (loaded from your browser's local storage).
* **`trackCurrentTask`** – Keeps track of the task you're currently editing.

---

### ✅ Main Functions

#### `addOrUpdateTask()`

* Uses `FormData` to gather input values from the task form.
* Checks if `trackCurrentTask` is set – if so, it's an update; otherwise, it's a new task.
* Validates that title, status, and priority fields are not empty.
* Calls `generateTaskId()` if creating a new task.
* Uses `taskData.push()` to add or `.map()` to update the existing task.
* Saves the array with `saveTasksToStorage()` and refreshes UI with `updateTaskContainer()`.

#### `showErrorDialog(message)`

* Takes a string `message` and updates the dialog box content.
* Uses `showModal()` on a native HTML `<dialog>` element to pop up the error.

#### `updateTaskContainer()`

* Clears all task containers (`todo`, `in-progress`, `done`) using `innerHTML = ""`.
* Loops through `taskData` and inserts each task's HTML using `getTaskElementHTML()`.
* Uses `insertAdjacentHTML()` to insert HTML into the appropriate container.
* Calls `bindTaskCardActions()` to activate buttons on the new tasks.

#### `bindTaskCardActions()`

* Uses `querySelectorAll()` to find all `.btn-edit` and `.btn-delete` buttons.
* Adds `addEventListener('click', ...)` to each button to trigger `editTask()` or `deleteTask()`.

#### `editTask(taskId)`

* Uses `.find()` to locate the task by ID from `taskData`.
* Populates the form fields with the task’s values (title, description, etc.).
* Sets `trackCurrentTask` so `addOrUpdateTask()` knows to update it.
* Opens the form modal.

#### `deleteTask(taskId)`

* Uses `.filter()` to remove the task with the matching ID.
* Saves the updated array to `localStorage` and calls `updateTaskContainer()`.

#### `resetTask()`

* Clears all form inputs using `.value = ''` and resets `trackCurrentTask = null`.
* Closes the form modal.

#### `editedForm()`

* Compares current form values with the values of `trackCurrentTask`.
* Returns `true` if any field is changed; otherwise, `false`.

#### `updateTaskStatus(taskId, newStatus)`

* Finds the task by ID and updates its `status` property.
* Saves and re-renders the tasks.

#### `initializeDragAndDrop()`

* Uses `dragstart`, `dragover`, and `drop` events.
* On drop, it calls `updateTaskStatus()` with the new column’s status.

#### `bindUIEvents()`

* Connects UI elements to their actions:

  * Add button opens the form
  * Cancel/Close resets the form
  * Submit button triggers `addOrUpdateTask()`

#### `bindDialogEvents()`

* Connects dialog cancel/discard buttons to reset or keep changes.

#### `init()`

* Calls all setup functions (`bindUIEvents()`, `bindDialogEvents()`, `initializeDragAndDrop()`).
* Loads tasks from storage and displays them.

---

## 📁 File: `taskService.ts`

This file stores shared things that describe what a task looks like and helps with task display and saving.

### 🧬 Enums

#### `Status`

* Used to identify task stage:

  * `Todo`, `InProgress`, `Done`

#### `Priority`

* Used to mark task importance:

  * `Low`, `Medium`, `High`

---

### 🧱 Interface

#### `Task`

* Blueprint for task objects:

  * `id`: unique string
  * `title`: string
  * `description`: string
  * `status`: one of `Status`
  * `priority`: one of `Priority`

---

### 🔧 Functions

#### `saveTasksToStorage(data)`

* Uses `JSON.stringify()` to convert the task array to a string.
* Stores it using `localStorage.setItem()` under the key "data".

#### `getTaskElementHTML(task)`

* Returns a template literal containing HTML markup.
* Displays task title, description, status, and priority.
* Adds Edit and Delete buttons with class names used for event binding.

---

## 📁 File: `utils.ts`

This file includes small helper functions used in multiple places.

### 🔧 Functions

#### `removeSpecialChars(value)`

* Uses `trim()` to remove whitespace.
* Uses `replace()` with a regular expression to remove characters except letters, numbers, dashes, and spaces.

#### `generateTaskId(title)`

* Calls `removeSpecialChars(title)` to sanitize the input.
* Converts the title to lowercase and replaces spaces with dashes using `split().join()`.
* Appends `Date.now()` to ensure a unique ID.

---

## 💾 Where are my tasks saved?

Your tasks are saved in the **browser’s local storage**, so even if you refresh the page, your tasks won’t disappear!

---

## 📌 How does drag and drop work?

You can grab a task by its box and drop it into another column (To Do → Done). The app updates the task’s status automatically.
