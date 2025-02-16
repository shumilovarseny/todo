import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { addExecutorValidation, deleteExecutorValidation, deleteTaskValidation, getTasksValidation, postTaskValidation, updateTaskValidation } from "../validations/tasksValidation.mjs";
import { addExecutor, createTask, deleteExecutor, deleteTask, getTasks, updateTask } from "../controllers/tasksController.mjs";

const tasksRouter = Router({});

tasksRouter.get('/', checkSchema(getTasksValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });
    const login = request.login;
    const { projects, search, sort, direction, filter, type } = matchedData(request);
    const tasks = await getTasks(projects, search, sort, direction, filter, login, type);
    if (tasks.error) return response.status(500).json({ error: "При поиске задач произошла ошибка на сервере" });

    return response.status(200).json(tasks);
});

tasksRouter.put('/', checkSchema(updateTaskValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { taskId, name, dueDate, description, priority } = matchedData(request);
    const task = await updateTask(taskId, name, dueDate, description, priority, login);
    if (task.error) {
        let message, status;
        if (task.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = task.error.statusCode;
        }
        else if (task.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Не удалось найти задачу";
            status = task.error.statusCode;
        }
        else {
            message = "При изменении задачи произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(task);
})

tasksRouter.post('/', checkSchema(postTaskValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { name, dueDate, description, priority, projectId } = matchedData(request);
    const tasks = await createTask(name, dueDate, description, priority, login, projectId);
    if (tasks.error) return response.status(500).json({ error: "При создании задачи произошла ошибка на сервере" });

    return response.status(200).json(tasks);
});

tasksRouter.delete('/:taskId', checkSchema(deleteTaskValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { taskId } = matchedData(request);
    const deleteResult = await deleteTask(login, taskId);
    if (deleteResult.error) {
        let message, status;
        if (deleteResult.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = deleteResult.error.statusCode;
        }
        else if (executor.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Не удалось найти задачу";
            status = executor.error.statusCode;
        }
        else {
            message = "При удалении задачи произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(deleteResult);
});

tasksRouter.post("/add-executor", checkSchema(addExecutorValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { taskId, memberId } = matchedData(request);
    const executor = await addExecutor(login, taskId, memberId);
    if (executor.error) {
        let message, status;
        if (executor.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = executor.error.statusCode;
        } else if (executor.error.errorCode == "ERR_ALREADY_EXISTS") {
            message = "Этот пользователь уже добавлен в задачу";
            status = executor.error.statusCode;
        } else {
            message = "При добавлении пользователя в задачу произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(executor);
});

tasksRouter.delete("/delete-executor/:taskId/:memberId", checkSchema(deleteExecutorValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { taskId, memberId } = matchedData(request);
    const executor = await deleteExecutor(login, taskId, memberId);
    if (executor.error) {
        let message, status;
        if (executor.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = executor.error.statusCode;
        }
        else if (executor.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Не удалось найти пользователя пользователя в задаче";
            status = executor.error.statusCode;
        }
        else {
            message = "При удалении пользователя из задачи произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(executor);
});

export default tasksRouter;