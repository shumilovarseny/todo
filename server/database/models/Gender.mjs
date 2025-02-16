import { DataTypes } from "@sequelize/core";
import sequelize from "../connection.mjs";

const Gender =
  sequelize.define(
    "genders",
    {
      id: {
        type:DataTypes.CHAR(1),
        primaryKey: true,
      },
      name: {
        type:DataTypes.STRING(7),
        allowNull: false,
      },
    }
  );
export default Gender;