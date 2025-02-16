import { Op, fn, col } from "@sequelize/core";
import { models } from "../database/database.mjs";
import Member from "../database/models/Member.mjs";
import { AccessDenied, FailedComplete, NoDataFound, returnErrorInfo } from "../utils/errors.mjs";
import User from "../database/models/Users.mjs";
const { Project } = models;

export const createProject = async (userId, name, description, image) => {
    try {
        const project = await Project.create({
            name,
            description,
            image,
            status: true
        });
        if (!project) throw new FailedComplete();

        const member = await Member.create({
            userId,
            projectId: project.dataValues.id,
            roleId: 's'
        });
        if (!member) throw new FailedComplete();

        return project.dataValues;
    } catch (e) { return returnErrorInfo(e); }
};

export const updateProject = async (userId, projectId, name, description, status, image) => {
    try {
        const creator = await Member.findOne({
            where: {
                [Op.and]: [
                    { projectId },
                    { roleId: 's' }
                ]
            }
        });
        if (!creator) throw new FailedComplete();
        if ((creator.dataValues.userId != userId)) throw new AccessDenied();

        const oldImage = await Project.findOne({ where: { id: projectId }, attributes: ['image', 'id'] });
        if (!oldImage) throw new NoDataFound();

        const project = await Project.update({
            name,
            description,
            status: status == "true" ? true : false,
            image
        }, { where: { id: projectId } })
        if (!project) throw new FailedComplete();
        if (!project[0]) throw new NoDataFound();

        return oldImage.dataValues;
    } catch (e) { return returnErrorInfo(e); }
}

export const getProject = async (userId, projectId) => {
    try {
        const member = await Member.findOne({
            where: {
                [Op.and]: [
                    { projectId },
                    { userId }
                ]
            }
        });
        if (!member) throw new AccessDenied();

        const project = await Project.findOne({
            include: [
                {
                    model: Member,
                    required: true,
                    where: { roleId: 's' }
                }
            ], where: { id: projectId }
        });
        if (!project) throw new NoDataFound()
        const director = await User.findOne({
            where: {
                email: project.dataValues.members[0].userId
            }
        })
        if (!director) throw new NoDataFound()
        delete project.dataValues.members
        project.dataValues.director = director;
        return project.dataValues;
    } catch (e) { return returnErrorInfo(e); }
}

export const getAllProjects = async (userId, status, search) => {
    try {
        const whereQuery = [{ name: { [Op.iLike]: `%${search}%` } }];
        if (status == "active") whereQuery.push({ status: true });
        else if (status == "inactive") whereQuery.push({ status: false });

        const projects = await Project.findAll({
            include: [
                {
                    model: Member,
                    required: true,
                    where: { userId }
                }
            ],
            where: { [Op.and]: whereQuery }
        });
        if (!projects) throw new FailedComplete();
        return projects;
    } catch (e) { return returnErrorInfo(e); }
}

export const deleteProject = async (userId, projectId) => {
    try {
        const creator = await Member.findOne({
            where: {
                [Op.and]: [
                    { projectId },
                    { roleId: 's' }
                ]
            }
        });
        if (!creator) throw new FailedComplete();
        if ((creator.dataValues.userId != userId)) throw new AccessDenied();

        const deleteResult = await Project.destroy({ where: { id: projectId } })
        if (deleteResult == 0) throw new NoDataFound();
        if (!deleteResult) throw new FailedComplete();

        return { projectId };
    } catch (e) { return returnErrorInfo(e); }
}