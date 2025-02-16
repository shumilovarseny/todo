import { sequelize, models } from "../database/database.mjs"
const { RefreshToken } = models;

import { FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";

export const createToken = async (email, token) => {
    try {
        const refreshToken = await RefreshToken.upsert({
            token,
            userId: email
        }, {
            where: {
                userId: email
            }
        });
        if (!refreshToken) throw FailedComplete();
        return refreshToken.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};

export const deleteToken = async (email) => {
    try {
        const deleteToken = await RefreshToken.destroy({
            where: {
                userId: email
            }
        });
        if (!deleteToken) throw FailedComplete();
        return deleteToken;
    } catch (e) { return returnErrorInfo(e); }
};

export const findToken = async (token) => {
    try {
        const foundToken = await RefreshToken.findOne({
            where: {
                token
            }
        });
        if (!foundToken) throw new NoDataFound();
        return foundToken;
    } catch (e) { return returnErrorInfo(e); }
}