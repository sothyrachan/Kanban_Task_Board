// ====== Enums ======
export enum Status {
    Todo = "todo",
    InProgress = "in-progress",
    Done = "done",
}

export enum Priority {
    Low = "low",
    Medium = "medium",
    High = "high",
}

// ====== Task Type ======
export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
}

// ====== Local Storage ======
export const saveTasksToStorage = (data: Task[]) =>
    localStorage.setItem("data", JSON.stringify(data));

// ====== UI Helper ======
export const getTaskElementHTML = (task: Task): string => `
  <p class="text-sm"><strong>Title:</strong> ${task.title}</p>
  <p class="text-sm"><strong>Description:</strong> ${task.description}</p>
  <p class="text-sm"><strong>Status:</strong> ${task.status}</p>
  <p class="text-sm"><strong>Priority:</strong> ${task.priority}</p>
  <div class="mt-2 flex gap-2">
    <button type="button" class="btn btn-edit">Edit</button>
    <button type="button" class="btn btn-delete">Delete</button>
  </div>
`;