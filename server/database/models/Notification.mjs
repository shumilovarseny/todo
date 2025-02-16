import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import User from './Users.mjs';

const Notification = sequelize.define(
    'notifications',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        inspected: DataTypes.BOOLEAN,
        userId: {
            type: DataTypes.STRING(254),
            allowNull: false,
            onDelete: "CASCADE",
            references: {
                model: User,
                key: "email"
            }
        }
    }
)

export default Notification;