import { Op, Sequelize } from "@sequelize/core";
import { models, sequelize } from "../database/database.mjs";
import { AccessDenied, AlreadyExistsError, FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";
import accessRules from "../utils/accessRules.mjs"
const { Member, User } = models;

const checkAcces = async (login, memberId, projectId) => {
    try {
        const member = await findMember(memberId, projectId);
        if (!member) throw new FailedComplete();

        const user = await findMember(login, projectId);
        if (!user) throw new FailedComplete();

        const resultAcces = accessRules(member.dataValues.roleId, user.dataValues.roleId);
        return resultAcces;
    } catch (e) { return null; }
}

export const findMember = async (userId, projectId) => {
    try {
        const member = await Member.findOne({
            where: {
                [Op.and]: [
                    { projectId },
                    { userId }
                ]
            }
        });
        if (!member) throw new FailedComplete();
        return member;
    } catch (e) { return null; }
}

export const deleteMember = async (login, memberId, projectId) => {

    if (login != memberId) {
        const resultAcces = await checkAcces(login, memberId, projectId);
        if (resultAcces === null) throw new FailedComplete();
        if (!resultAcces) throw new AccessDenied();
    }

    const deleteResult = await Member.destroy({ where: { userId: memberId, projectId } })
    if (deleteResult == 0) throw new NoDataFound();
    if (!deleteResult) throw new FailedComplete();

    return deleteResult;

}

export const getAllMembers = async (login, projectId, search, withAccess = false) => {
    try {
        const searchQuery = search.replaceAll(" ", "%");
        const user = await findMember(login, projectId);
        if (!user) throw new AccessDenied();
        const condition = [{ projectId }]
        if (withAccess) {
            const roles = [{ userId: login }];
            if (user.dataValues.roleId == "s") {
                roles.push({ roleId: "a" }, { roleId: "m" });
            }
            else if (user.dataValues.roleId == "a") roles.push({ roleId: "m" });
            condition.push({ [Op.or]: roles });
        }

        const members = await Member.findAll({
            attributes: ['id', 'userId', 'roleId'],
            where: { [Op.and]: condition },
            include: [{
                model: User,
                required: true,
                attributes: { exclude: ['password'] },
                where: {
                    [Op.or]: [
                        { email: { [Op.iLike]: `%${search}%` } },
                        Sequelize.literal(`format('%s %s', surname, name) ILIKE '%${searchQuery}%'`),
                        Sequelize.literal(`format('%s %s', name, surname) ILIKE '%${searchQuery}%'`)
                    ]
                },
            }],
            order: [
                [Sequelize.literal(`CASE "userId" WHEN '${login}' THEN 0 ELSE 1 END`), 'ASC'],
                [Sequelize.literal(`format('%s %s', "users"."surname", "users"."name")`), 'ASC'],
            ],
        });
        if (!members) throw new FailedComplete();
        return members;
    } catch (e) { return returnErrorInfo(e); }
}

export const getNonMembers = async (login, projectId, search) => {
    try {
        const searchQuery = search.replaceAll(" ", "%");
        const user = await findMember(login, projectId);
        if (!user) throw new AccessDenied();

        const nonMembers = await sequelize.query(`  
            select u.email,u.name,u.surname,u.image from users u 
            where not exists (select * from members m where m."projectId"=${projectId} and m."userId"=u.email) and 
            ( u.email ILIKE '%${search}%' or format('%s %s', u.surname, u.name) ILIKE '%${searchQuery}%' or format('%s %s', u.name, u.surname) ILIKE '%${searchQuery}%')
            order by format('%s %s', u.surname, u.name) asc
        `);
        if (!nonMembers) throw new FailedComplete();

        return nonMembers[0];
    } catch (e) { return returnErrorInfo(e); }
}

export const addMember = async (login, userId, projectId) => {
    try {
        const user = await findMember(login, projectId);
        if (!user) throw new FailedComplete();
        if (user.dataValues.roleId == "m") throw new AccessDenied();

        const member = await findMember(userId, projectId);
        if (!member && member !== null) throw new FailedComplete();
        if (member !== null) throw new AlreadyExistsError();

        const memberCreate = await Member.create({
            userId,
            projectId,
            roleId: 'm'
        });
        if (!memberCreate) throw new FailedComplete();
        return memberCreate.dataValues;
    } catch (e) { return returnErrorInfo(e); }
}

export const putRoleMember = async (login, userId, projectId, roleId) => {
    try {
        const user = await findMember(login, projectId);
        if (!user) throw new FailedComplete();
        if (user.dataValues.roleId != "s") throw new AccessDenied();

        const updateResult = await Member.update({ roleId }, {
            where: {
                [Op.and]: [
                    { userId },
                    { projectId }
                ]
            }
        });
        if (!updateResult) throw new FailedComplete();

        if (roleId == "s") {
            const removalResult = await Member.update({ roleId: "a" }, {
                where: {
                    [Op.and]: [
                        { userId: login },
                        { projectId }
                    ]
                }
            });
            if (!removalResult) throw new FailedComplete();
        }

        return { userId, roleId };
    } catch (e) { return returnErrorInfo(e); }
}