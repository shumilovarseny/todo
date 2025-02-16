import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { addMemberValidation, deleteMemberValidation, getAccessMembersValidation, getAllMembersValidation, getNonMembersValidation, putMemberValidation } from "../validations/memberValidation.mjs";
import { addMember, deleteMember, getAllMembers, getNonMembers, putRoleMember } from "../controllers/membersController.mjs";

const membersRouter = Router({});
const membersTextRouter = "/:projectId/members";

membersRouter.get(`${membersTextRouter}/`, checkSchema(getAllMembersValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId, search } = matchedData(request);
    const members = await getAllMembers(login, projectId, search);
    if (members.error) {
        let message, status;
        if (members.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = members.error.statusCode;
        }
        else {
            message = "При поиске участников произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(members);
});

membersRouter.get(`${membersTextRouter}/access`, checkSchema(getAccessMembersValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId, search } = matchedData(request);
    const members = await getAllMembers(login, projectId, search, true);
    if (members.error) {
        let message, status;
        if (members.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = members.error.statusCode;
        }
        else {
            message = "При поиске участников произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(members);
});

membersRouter.get(`${membersTextRouter}/non`, checkSchema(getNonMembersValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { projectId, search } = matchedData(request);
    const nonMembers = await getNonMembers(login, projectId, search);
    if (nonMembers.error) {
        let message, status;
        if (nonMembers.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = nonMembers.error.statusCode;
        }
        else {
            message = "При поиске пользователей, которые не состоят в проекте произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(nonMembers);
});

membersRouter.delete(`${membersTextRouter}/:memberId`, checkSchema(deleteMemberValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { memberId, projectId } = matchedData(request);
    const member = await deleteMember(login, memberId, projectId);
    if (member.error) {
        let message, status;
        if (member.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = member.error.statusCode;
        }
        else {
            message = "При удалении участника произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(member);
});

membersRouter.post(`${membersTextRouter}/`, checkSchema(addMemberValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { userId, projectId } = matchedData(request);
    const member = await addMember(login, userId, projectId);
    if (member.error) {
        let message, status;
        if (member.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = member.error.statusCode;
        } else {
            message = "При добавлении пользователя в проект произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(member);
});


membersRouter.put(`${membersTextRouter}/`, checkSchema(putMemberValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { userId, projectId, roleId } = matchedData(request);
    const member = await putRoleMember(login, userId, projectId, roleId);
    if (member.error) {
        let message, status;
        if (member.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Отказано в доступе";
            status = member.error.statusCode;
        } else {
            message = "При изменении роли участника произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    return response.status(200).json(member);
});

export default membersRouter;