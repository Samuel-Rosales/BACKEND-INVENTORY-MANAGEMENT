"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncModels = exports.ProductDB = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const models_1 = require("../models");
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbDialect = process.env.DATABASE_DIALECT;
const dbHost = process.env.DATABASE_HOST;
const dbPort = Number(process.env.DATABASE_PORT);
const sequelizeConfig = {
    dialect: dbDialect,
    host: dbHost,
    logging: false,
    dialecOpions: {
        connectYimeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquiere: 30000,
        idle: 10000,
    },
};
if (dbHost !== "localhost") {
    sequelizeConfig.port = dbPort;
}
exports.db = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, sequelizeConfig);
const noTimeStampsOptions = {
    timestamps: false,
};
//Models
exports.ProductDB = exports.db.define("products", models_1.ProductModel, {
    timestamps: true,
    tableName: "products",
});
const syncModels = async () => {
    try {
        console.log('DB env', {
            DATABASE_DIALECT: process.env.DATABASE_DIALECT,
            DATABASE_HOST: process.env.DATABASE_HOST,
            DATABASE_USER: process.env.DATABASE_USER,
            DATABASE_PASSWORD_exists: !!process.env.DATABASE_PASSWORD,
            DATABASE_PORT: process.env.DATABASE_PORT
        });
        await exports.db.authenticate();
        console.log("Connecting to database...");
        await exports.db.sync({ alter: true });
        console.log("Database Synced");
    }
    catch (error) {
        console.error("Error to connect to database: ", error);
        throw error;
    }
};
exports.syncModels = syncModels;
(0, exports.syncModels)();
exports.default = exports.db;
