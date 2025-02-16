import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";
import User from "./Users.mjs";

const RefreshToken = sequelize.define(
    'refreshTokens',
    {
        token: {
            type: DataTypes.TEXT,
            primaryKey: true,
        },
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
);

export default RefreshToken;