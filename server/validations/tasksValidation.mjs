import simplifiedValidation from "../utils/simplifiedValidation.mjs";

export const postTaskValidation = simplifiedValidation({
    name: ["length-1-30", "n-empty"],
    dueDate: ["date"],
    description: ["length-0-250"],
    priority: ["boolean"],
    projectId: ["int"]
});

export const deleteTaskValidation = simplifiedValidation({
    taskId: ["int", "params"]
});

export const addExecutorValidation = simplifiedValidation({
    taskId: ["int"],
    memberId: ["int"]
});

export const deleteExecutorValidation = simplifiedValidation({
    taskId: ["int", "params"],
    memberId: ["int", "params"]
});

export const updateTaskValidation = simplifiedValidation({
    taskId: ["int"],
    name: ["length-1-30", "n-empty"],
    dueDate: ["date"],
    description: ["length-0-250"],
    priority: ["boolean"]
});

export const getTasksValidation = simplifiedValidation({
    projects: ["array-int,n-empty,query"],
    search: ["query"],
    sort: ["in-name-dueDate-priority", "query"],
    direction: ["in-asc-desc", "query"],
    filter: ["in-today-planned-completed-overdue", "query"],
    type: ["in-executor-director", "query"]
});

