import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs"
import Gender from "./Gender.mjs";

const User =
    sequelize.define(
        'users',
        {
            email: {
                type: DataTypes.STRING(254),
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false
            },
            surname: {
                type: DataTypes.STRING(30),
                allowNull: false
            },
            dateOfBirth: DataTypes.DATEONLY,
            image: DataTypes.STRING(500),
            password: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            genderId: {
                type: DataTypes.CHAR(1),
                references: {
                    model: Gender,
                    key: "id"
                }
            }
        }
    );

export default User;