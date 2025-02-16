import jwt from "jsonwebtoken";
import { createToken as createTokenController, findToken } from "../controllers/tokenController.mjs";

export const createToken = async (email) => {
    const payload = {
        email
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    const resultCreateToken = createTokenController(email, refreshToken);
    if (resultCreateToken.error) return resultCreateToken;
    return { accessToken: accessToken, refreshToken: refreshToken };
};

export const refreshAccessToken = async (refresh) => {
    const searchResult = await findToken(refresh);
    if (searchResult.error) return;
    const refreshResult = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return;
        ['iat', 'exp'].forEach(e => delete user[e]);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        return { accessToken, payload: user };
    })
    return refreshResult;
};

export const addTokenToCookies = async (email, response) => {
    const tokens = await createToken(email);
    if (tokens.error) return false;

    response.cookie('accessToken', tokens.accessToken);
    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return true;
};