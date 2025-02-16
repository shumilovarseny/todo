import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
(await import('dotenv')).config();

const sequelize = new Sequelize(
  {
    dialect: PostgresDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
      freezeTableName: true,
      timestamps: false,
      logging: false,
    },
  }
);

export default sequelize;