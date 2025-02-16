import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { deleteProjectValidation, getProjectsValidation, getProjectValidation, projectCreateValidation, projectUpdateValidation } from "../validations/projectsValidation.mjs";
import { createProject, deleteProject, getAllProjects, getProject, updateProject } from "../controllers/projectsController.mjs";
import fs from 'fs';

const projectsRouter = Router({});

projectsRouter.post('/', checkSchema(projectCreateValidation), async (request, response) => {
    try {
        const validation = validationResult(request);
        if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });
        const login = request.login;
        const { name, description } = matchedData(request);
        const image = request.files && request.files.length > 0 ? request.files[0].filename : null;
        const project = await createProject(login, name, description, image);
        if (project.error) {
            return response.status(500).json({ error: "При создании пользователя произошла ошибка на сервере" });
        }
        return response.status(200).json(project);
    } catch {
        return response.status(500).json({ error: "При создании пользователя произошла ошибка на сервере" });
    }
});

projectsRouter.put('/', checkSchema(projectUpdateValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId, name, description, status } = matchedData(request);
    const image = request.files && request.files.length > 0 ? request.files[0].filename : null;
    const project = await updateProject(login, projectId, name, description, status, image);
    if (project.error) {
        let message, status;
        if (project.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = project.error.statusCode;
        }
        else if (project.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого проекта не существует";
            status = project.error.statusCode;
        }
        else {
            message = "При обновлении данных произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }
    fs.unlink(`uploads/${project.image}`, () => { });
    return response.status(200).json(project);
});

projectsRouter.get('/', checkSchema(getProjectsValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });
    const login = request.login;
    const { status, search } = matchedData(request);
    const projects = await getAllProjects(login, status, search);
    if (projects.error) return response.status(500).json({ error: "При поиске проектов произошла ошибка на сервере" });
    return response.status(200).json(projects);
});

projectsRouter.get('/:projectId', checkSchema(getProjectValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId } = matchedData(request);
    const project = await getProject(login, projectId);
    if (project.error) {
        let message, status;
        if (project.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = project.error.statusCode;
        }
        else if (project.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого проекта не существует";
            status = project.error.statusCode;
        }
        else {
            message = "При поиске данных произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(project);
});

projectsRouter.delete('/:projectId', checkSchema(deleteProjectValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId } = matchedData(request);

    const project = await deleteProject(login, projectId);
    if (project.error) {
        let message, status;
        if (project.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = project.error.statusCode;
        }
        else if (project.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого проекта не существует";
            status = project.error.statusCode;
        }
        else {
            message = "При удалении проекта произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(project);
});

export default projectsRouter;