import { refreshAccessToken } from "../utils/token.mjs"
import jwt from "jsonwebtoken";

const verifyTokenMiddleware = (request, response, next) => {
    const { accessToken, refreshToken } = request.cookies;
    if (!accessToken || !refreshToken) return response.sendStatus(401);
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            const refreshData = await refreshAccessToken(refreshToken);
            if (!refreshData) return response.sendStatus(401);
            user = refreshData.payload;
            response.cookie('accessToken', refreshData.accessToken);
        }
        request.login = user.email;
    })
    next();
};

export default verifyTokenMiddleware;