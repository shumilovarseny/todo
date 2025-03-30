import { where } from "@sequelize/core";
import { models } from "../database/database.mjs";
import { AccessDenied, AlreadyExistsError, FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";
const { User } = models;

export const getUserInfo = async (email) => {
    try {
        const user = await User.findOne({
            attributes: { exclude: ['password'] },
            where: { email }
        });
        if (!user) throw new NoDataFound();
        return user.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};

export const updateUserEmail = async (email, newEmail) => {
    try {
        const alreadyExists = await User.findOne({ where: { email: newEmail } });
        if (alreadyExists) throw new AlreadyExistsError();
        const user = await User.update(
            { email: newEmail },
            { where: { email } }
        );
        if (!user) throw new FailedComplete();
        return { newEmail }
    } catch (e) { return returnErrorInfo(e); }
};

export const updateUserPassword = async (email, password, newPassword) => {
    try {
        const user = await User.update(
            { password: newPassword },
            { where: { email, password } }
        );
        if (!user) throw new FailedComplete();
        if (!user[0]) throw new AccessDenied();
        return { email }
    } catch (e) { return returnErrorInfo(e); }
};

export const updateUserInfo = async (login, email, name, surname, dateOfBirth, genderId, image) => {
    try {
        if (login != email) throw new AccessDenied();

        const oldImage = await User.findOne({ where: { email }, attributes: ['image', 'email'] });
        if (!oldImage) throw new NoDataFound();

        const updateResult = await User.update(
            {
                name,
                surname,
                dateOfBirth,
                genderId,
                image
            },
            {
                where: { email: login }
            }
        );
        if (!updateResult) throw new FailedComplete();
        if (!updateResult[0]) throw new NoDataFound();
        return oldImage;
    } catch (e) { return returnErrorInfo(e); }
};

export const deleteUser = async (email) => {
    try {
        const deleteResult = await User.destroy({ where: { email } });
        if (deleteResult == 0) throw new NoDataFound();
        if (!deleteResult) throw new FailedComplete();
        return { email }
    } catch (e) { return returnErrorInfo(e); }
}