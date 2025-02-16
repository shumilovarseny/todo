import { Router } from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import { loginValidation, registrationValidation } from "../validations/authorizationValidation.mjs";
import { createUser, loginUser } from "../controllers/authorizationController.mjs";
import { addTokenToCookies } from "../utils/token.mjs";
import { deleteToken } from "../controllers/tokenController.mjs";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.mjs"

const authorizationRouter = Router({});

authorizationRouter.post('/registration', checkSchema(registrationValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const { email, name, surname, password } = matchedData(request);
    const registrationResult = await createUser(email, name, surname, password);
    if (registrationResult.error) {
        let message, status;
        if (registrationResult.error.errorCode == "ERR_ALREADY_EXISTS") {
            message = "Пользователь с такой почтой уже существует";
            status = registrationResult.error.statusCode;
        }
        else {
            message = "При создании пользователя произошла ошибка на сервере";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    const resultAddTokenToCookies = await addTokenToCookies(registrationResult.email, response);
    if (!resultAddTokenToCookies) return response.status(401).json({ error: "Не удалось войти в систему" });
    delete registrationResult.password;
    response.cookie('user', JSON.stringify(registrationResult));
    return response.status(200).json(registrationResult)
});

authorizationRouter.post('/login', checkSchema(loginValidation), async (request, response) => {
    const validation = validationResult(request);
    if (validation.errors.length) return response.status(400).send({ error: "Ошибка валидации" });

    const { email, password } = matchedData(request);
    const loginResult = await loginUser(email, password);
    if (loginResult.error) {
        let message, status;
        if (loginResult.error.errorCode == "ERR_NO_DATA_FOUND") {
            message = "Неверный логин или пароль";
            status = loginResult.error.statusCode;
        }
        else {
            message = "На сервере произошла ошибка";
            status = 500;
        }
        return response.status(status).json({ error: message });
    }

    const resultAddTokenToCookies = await addTokenToCookies(loginResult.email, response);
    if (!resultAddTokenToCookies) return response.status(401).json({ error: "Не удалось войти в систему" });
    delete loginResult.password;
    response.cookie('user', JSON.stringify(loginResult));
    return response.status(200).json(loginResult);
})

authorizationRouter.post('/logout', verifyTokenMiddleware, async (request, response) => {
    const login = request.login;
    const loginResult = await deleteToken(login);
    if (loginResult.error) return response.status(500).json({ error: "При выходе произошла ошибка на сервере" });
    response.cookie('user', '');
    response.cookie('accessToken', '');
    response.cookie('refreshToken', '');
    return response.status(200).json(loginResult);
})

export default authorizationRouter;