"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbDialect = process.env.DATABASE_DIALECT;
const dbHost = process.env.DATABASE_HOST;
const dbPort = Number(process.env.DATABASE_PORT);
// Configuración de Sequelize (con los typos corregidos)
const sequelizeConfig = {
    dialect: dbDialect,
    host: dbHost,
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
if (dbHost !== "localhost") {
    sequelizeConfig.port = dbPort;
}
// Se crea y se exporta la instancia de Sequelize.
// Esta es la única responsabilidad principal de este archivo.
exports.db = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, sequelizeConfig);
