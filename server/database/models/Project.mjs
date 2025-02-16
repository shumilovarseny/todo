import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";

const Project = sequelize.define(
    'projects',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        image: DataTypes.STRING(500),
        description: DataTypes.STRING(250),
        status: DataTypes.BOOLEAN
    }
);

export default Project;