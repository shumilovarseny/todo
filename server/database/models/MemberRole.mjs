import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";

const MemberRole = sequelize.define(
    'memberRoles',
    {
        id: {
            type: DataTypes.CHAR(1),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(11),
            allowNull: false
        }
    }
);

export default MemberRole;