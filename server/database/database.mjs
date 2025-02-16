import sequelize from "./connection.mjs";
import Gender from "./models/Gender.mjs";
import User from "./models/Users.mjs";
import Project from "./models/Project.mjs";
import MemberRole from "./models/MemberRole.mjs";
import Member from "./models/Member.mjs";
import Task from "./models/Task.mjs";
import Notification from "./models/Notification.mjs";
import Request from "./models/Request.mjs";
import Executor from "./models/Executor.mjs";
import RefreshToken from "./models/RefreshToken.mjs";
import { FailedComplete } from "../utils/errors.mjs";

const models = {
    Gender,
    User,
    Project,
    MemberRole,
    Member,
    Task,
    Notification,
    Request,
    Executor,
    RefreshToken
};

try {
    const insertDataInLookupTable = async (data, model) => {
        data.forEach(async (value) => {
            const result = await model.findOrCreate({
                where: {
                    id: value.id,
                    name: value.name
                }
            });
            if (!result) throw new FailedComplete();
        });
    }

    await sequelize.sync({ alter: true });
    const gendersData = [{ id: "m", name: "Мужчина" }, { id: "f", name: "Женщина" }];
    await insertDataInLookupTable(gendersData, Gender);
    const memberRolesData = [{ id: "s", name: "Супер-админ" }, { id: "a", name: "Админ" }, { id: "m", name: "Участник" }];
    await insertDataInLookupTable(memberRolesData, MemberRole);
    console.log("База данных синхронизирована");
} catch (e) {
    console.error("Ошибка синхронизации базы данных:", e);
}

export { sequelize, models };