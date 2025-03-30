import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import Member from "./Member.mjs";
import Notification from "./Notification.mjs";

const Request = sequelize.define(
    'requests',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            references: {
                model: Member,
                key: "id"
            }
        },
        notificationId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            references: {
                model: Notification,
                key: "id"
            },
        }
    }
);

Notification.hasOne(Request, {
    foreignKey: {
        name: "notificationId",
    }
});


export default Request;