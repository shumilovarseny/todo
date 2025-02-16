import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import User from './Users.mjs';
import Project from './Project.mjs';
import MemberRole from './MemberRole.mjs';

const Member = sequelize.define(
    'members',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING(254),
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: User,
                key: "email"
            }
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: Project,
                key: "id"
            }
        },
        roleId: {
            type: DataTypes.CHAR(1),
            references: {
                model: MemberRole,
                key: "id"
            }
        },
    }
);

Project.hasMany(Member, { foreignKey: 'projectId' });
Member.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Member, { foreignKey: 'userId' });
Member.belongsTo(User, { foreignKey: 'userId' });

export default Member;