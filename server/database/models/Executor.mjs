import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import Member from "./Member.mjs";
import Task from "./Task.mjs";

const Executor = sequelize.define(
    'executors',
    {
        taskId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: Task,
                key: "id"
            }
        },
        memberId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: Member,
                key: "id"
            }
        }
    }
);

Member.hasMany(Executor, { foreignKey: 'memberId' });
Executor.belongsTo(Member, { foreignKey: 'memberId' });

Task.hasMany(Executor, { foreignKey: 'taskId' });
Executor.belongsTo(Task, { foreignKey: 'taskId' });


export default Executor;