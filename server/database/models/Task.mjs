import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import Member from "./Member.mjs";

const Task = sequelize.define(
    'tasks',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(30),
        dueDate: DataTypes.DATE,
        description: DataTypes.STRING(250),
        priority: DataTypes.BOOLEAN,
        status: DataTypes.BOOLEAN,
        directorId: {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Member,
                key: "id"
            }
        }
    }
);


Member.hasMany(Task, { foreignKey: 'directorId' });
Task.belongsTo(Member, { foreignKey: 'directorId' });

export default Task;
