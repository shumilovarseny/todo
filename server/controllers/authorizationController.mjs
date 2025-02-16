import { models } from "../database/database.mjs"
const { User } = models;
import { AlreadyExistsError, FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";

export const createUser = async (email, name, surname, password) => {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new AlreadyExistsError();
        const user = await User.create({
            email,
            name,
            surname,
            password
        });
        if (!user) throw new FailedComplete();
        return user.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};

export const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({
            where: {
                email,
                password
            }
        });
        if (!user) throw new NoDataFound();
        return user.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};
