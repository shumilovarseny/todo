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

export const updateUserInfo = async (login, email, name, surname, dateOfBirth, genderId, image) => {
    try {
        if (login != email) throw new AccessDenied();
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
        const user = await getUserInfo(email);
        if (!user) throw new NoDataFound();
        delete user.password;
        return user;
    } catch (e) { return returnErrorInfo(e); }
};

export const deleteUser = async (email) => {

    const deleteResult = await User.destroy({ where: { email } });
    if (deleteResult == 0) throw new NoDataFound();
    if (!deleteResult) throw new FailedComplete();
    return { email }

}