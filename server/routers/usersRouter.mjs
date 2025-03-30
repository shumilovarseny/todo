import { request, response, Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { userChangeEmailValidation, userChangePasswordValidation, userInfoValidation, userPutDataValidation } from "../validations/usersValidation.mjs";
import { deleteUser, getUserInfo, updateUserEmail, updateUserInfo, updateUserPassword } from "../controllers/usersController.mjs";
import fs from 'fs';

const usersRouter = Router({});

usersRouter.get('/:userId', checkSchema(userInfoValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const { userId } = matchedData(request);

    const user = await getUserInfo(userId);
    if (user.error) {
        let message, status;
        if (user.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого пользователя не существует";
            status = user.error.statusCode;
        }
        else {
            message = "При поиске пользователя произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message })
    }
    return response.status(200).json(user);
})

usersRouter.put('/', checkSchema(userPutDataValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const login = request.login;
    const { email, name, surname, dateOfBirth, genderId } = matchedData(request);
    const image = request.files && request.files.length > 0 ? request.files[0].filename : null;

    const user = await updateUserInfo(login, email, name, surname, dateOfBirth, genderId, image);
    if (user.error) {
        let message, status;
        if (user.error.errorCode == "ERR_ALREADY_EXISTS") {
            message = "Пользователь с такой почтой уже существует";
            status = user.error.statusCode;
        }
        else if (user.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого пользователя не существует";
            status = user.error.statusCode;
        }
        else {
            message = "При обновлении данных произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    response.cookie('user', JSON.stringify(user));
    fs.unlink(`uploads/${user.image}`, () => { });
    return response.status(200).json(user);
})


usersRouter.delete("/", async (request, response) => {
    const login = request.login;
    const user = await deleteUser(login);
    if (user.error) {
        let message, status;
        if (user.error.errorCode == "ERR_ALREADY_EXISTS") {
            message = "Пользователь с такой почтой уже существует";
            status = user.error.statusCode;
        }
        else if (user.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Такого пользователя не существует";
            status = user.error.statusCode;
        }
        else {
            message = "При обновлении данных произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }
    return response.status(200).json(user);
})

usersRouter.put("/change-email", checkSchema(userChangeEmailValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });
    const login = request.login;
    const { newEmail } = matchedData(request);
    const user = await updateUserEmail(login, newEmail);
    if (user.error) {
        let message, status;
        if (user.error.errorCode == "ERR_ALREADY_EXISTS") {
            message = "Пользователь с такой почтой уже существует";
            status = user.error.statusCode;
        }
        else {
            message = "При поиске пользователя произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message })
    }
    return response.status(200).json(user);
})

usersRouter.put("/change-password", checkSchema(userChangePasswordValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });
    const login = request.login;
    const { password, newPassword } = matchedData(request);
    const user = await updateUserPassword(login, password, newPassword);
    if (user.error) {
        let message, status;
        if (user.error.errorCode == "ERR_ACCESS_DENIES") {
            message = "Не прошли проверку паролем";
            status = user.error.statusCode;
        }
        else {
            message = "При поиске пользователя произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message })
    }
    return response.status(200).json(user);
})

export default usersRouter;