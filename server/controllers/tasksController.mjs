import { models } from "../database/database.mjs";
import Executor from "../database/models/Executor.mjs";
import { AccessDenied, AlreadyExistsError, FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";
import { findMember } from "./membersController.mjs";
import accessRules from "../utils/accessRules.mjs"
import Sequelize, { Op } from "@sequelize/core";
import Project from "../database/models/Project.mjs";
import User from "../database/models/Users.mjs";

const { Task, Member } = models;

const checkAccesForExecutor = async (login, memberId) => {
    try {
        const member = await Member.findOne({
            where: { id: memberId }
        });
        if (!member) throw new FailedComplete();
        if (login == member.dataValues.userId) return true;

        const user = await findMember(login, member.projectId);
        if (!user) throw new FailedComplete();

        const resultAcces = accessRules(member.dataValues.roleId, user.dataValues.roleId)
        return resultAcces;
    } catch (e) { return null; }
}

const checkAccesForTask = async (taskId, login) => {
    try {
        const director = await Member.findOne({
            attributes: ["projectId", "userId"],
            include: [{
                model: Task,
                required: true,
                attributes: [],
                where: { id: taskId }
            }]
        });
        if (!director) throw new FailedComplete();

        const member = await Member.findOne({
            attributes: ["roleId"],
            where: {
                [Op.and]: [
                    { projectId: director.projectId },
                    { userId: login }
                ]
            }
        });
        if (!member) throw new FailedComplete();
        return login == director.userId || member.roleId == 'a' || member.roleId == 's';
    } catch (e) { return null }
}

export const createTask = async (name, dueDate, description, priority, userId, projectId) => {
    try {
        const directorId = await Member.findOne({
            attributes: ["id"],
            where: {
                projectId,
                userId
            }
        });
        if (directorId === null) throw new AccessDenied();
        if (!directorId) throw new FailedComplete();

        const task = await Task.create({
            name,
            dueDate,
            description,
            priority: priority == "true" ? true : false,
            status: true,
            directorId: directorId.id
        })
        if (!task) throw new FailedComplete();
        return task.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};

export const getTasks = async (projects, search, sort, direction, filter, userId, type) => {
    try {
        const projectsId = [];
        projects.forEach(key => projectsId.push({ projectId: key }));
        const tasksOption = [{ name: { [Op.iLike]: `%${search}%` } }];

        const date = new Date();
        switch (filter) {
            case "today":
                tasksOption.push(Sequelize.literal(`DATE("dueDate") = DATE('${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}')`));
                tasksOption.push({ status: true });
                break;
            case "planned":
                tasksOption.push({ dueDate: { [Op.gte]: date } });
                tasksOption.push({ status: true });
                break;
            case "completed":
                tasksOption.push({ status: false });
                break;
            case "overdue":
                tasksOption.push({ dueDate: { [Op.lte]: date } });
                tasksOption.push({ status: true });
                break
            default:
                break
        }

        const tasks = await Task.findAll({
            where: { [Op.and]: tasksOption },
            order: [[sort, direction]],
            include: [
                {
                    model: Executor,
                    required: true,
                    include: {
                        model: Member,
                        required: true,
                        where: type == "executor" ? { [Op.and]: [{ userId }, { [Op.or]: projectsId }] } : {},
                        include: {
                            model: User,
                            required: true,
                            attributes: { exclude: ['password'] }
                        }
                    }
                },
                {
                    model: Member,
                    required: true,
                    where: type == "director" ? { [Op.and]: [{ userId }, { [Op.or]: projectsId }] } : {},
                    include: [
                        {
                            model: Project,
                            required: true,
                        },
                        {
                            model: User,
                            required: true,
                            attributes: { exclude: ['password'] }
                        }
                    ]
                }
            ]
        });
        if (!tasks) throw new FailedComplete();
        const editedDataTasks = [];
        tasks.forEach((task) => {
            const data = {
                status: task.status,
                name: task.name,
                dueDate: task.dueDate,
                description: task.description,
                priority: task.priority,
                project: {
                    id: task.members.projects.id,
                    name: task.members.projects.name,
                    image: task.members.projects.image,
                },
                director: {
                    email: task.members.users.email,
                    name: `${task.members.users.surname} ${task.members.users.name}`,
                    image: task.members.users.image,
                },
                executor: {
                    email: task.executors[0].members.users.email,
                    name: `${task.executors[0].members.users.surname} ${task.executors[0].members.users.name}`,
                    image: task.executors[0].members.users.image,
                },
            };
            editedDataTasks.push(data);
        })
        return editedDataTasks;
    } catch (e) { return returnErrorInfo(e); }
};

export const updateTask = async (taskId, name, dueDate, description, priority, login) => {
    try {
        const accessResult = await checkAccesForTask(taskId, login);
        if (accessResult === null) throw new FailedComplete();
        if (!accessResult) throw new AccessDenied();

        const updateResult = await Task.update({
            name,
            dueDate,
            description,
            priority
        }, {
            where: {
                id: taskId
            }
        });
        if (!updateResult) throw new FailedComplete();
        if (!updateResult[0]) throw new NoDataFound();
        return { taskId };
    } catch (e) { return returnErrorInfo(e); }
}

export const deleteTask = async (login, taskId) => {
    try {
        const accessResult = await checkAccesForTask(taskId, login);
        if (accessResult === null) throw new FailedComplete();
        if (!accessResult) throw new AccessDenied();

        const deleteResult = await Task.destroy({
            where: {
                id: taskId
            }
        });
        if (deleteResult == 0) throw new NoDataFound();
        if (!deleteResult) throw new FailedComplete();

        return { taskId };
    } catch (e) { return returnErrorInfo(e); }
};

export const addExecutor = async (login, taskId, memberId) => {
    try {
        const payload = { taskId, memberId };

        const resultAcces = await checkAccesForExecutor(login, memberId);
        if (resultAcces === null) throw new FailedComplete();
        if (!resultAcces) throw new AccessDenied();

        const alreadyComplete = await Executor.findOne({ where: payload });
        if (!alreadyComplete && alreadyComplete !== null) throw new FailedComplete();
        else if (alreadyComplete !== null) throw new AlreadyExistsError();

        const executor = await Executor.create(payload);
        if (!executor) throw new FailedComplete();

        return executor.dataValues;
    } catch (e) { return returnErrorInfo(e); }
}

export const deleteExecutor = async (login, taskId, memberId) => {
    try {
        const payload = { taskId, memberId };

        const resultAcces = await checkAccesForExecutor(login, memberId);
        if (resultAcces === null) throw new FailedComplete();
        if (!resultAcces) throw new AccessDenied();

        const deleteResult = await Executor.destroy({ where: payload });
        if (deleteResult == 0) throw new NoDataFound();
        if (!deleteResult) throw new FailedComplete();

        return { memberId };
    } catch (e) { return returnErrorInfo(e); }
}