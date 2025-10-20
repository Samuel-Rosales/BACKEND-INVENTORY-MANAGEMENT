"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncModels = exports.UserDB = exports.TypePaymentDB = exports.RolDB = exports.PurchaseDB = exports.ProviderDB = exports.ProductDB = exports.MovementDB = exports.DepotDB = exports.CategoryDB = exports.db = void 0;
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
// Models
exports.CategoryDB = exports.db.define("categories", models_1.CategoryModel, {
    timestamps: true,
    tableName: "categories",
});
exports.DepotDB = exports.db.define("depots", models_1.DepotModel, {
    timestamps: true,
    tableName: "depots",
});
exports.MovementDB = exports.db.define("movements", models_1.MovementModel, {
    timestamps: true,
    tableName: "movements",
});
exports.ProductDB = exports.db.define("products", models_1.ProductModel, {
    timestamps: true,
    tableName: "products",
});
exports.ProviderDB = exports.db.define("providers", models_1.ProviderModel, {
    timestamps: true,
    tableName: "providers",
});
exports.PurchaseDB = exports.db.define("purchases", models_1.PurchaseModel, {
    timestamps: true,
    tableName: "purchases",
});
exports.RolDB = exports.db.define("rols", models_1.RolModel, {
    timestamps: true,
    tableName: "rols",
});
exports.TypePaymentDB = exports.db.define("types_payments", models_1.TypePaymentModel, {
    timestamps: true,
    tableName: "types_payments",
});
exports.UserDB = exports.db.define("users", models_1.UserModel, {
    timestamps: true,
    tableName: "users",
});
// Relacionships
exports.ProductDB.belongsTo(exports.CategoryDB, { foreignKey: "category_id", as: "category" });
exports.CategoryDB.hasMany(exports.ProductDB, { foreignKey: "category_id", as: "products" });
exports.MovementDB.belongsTo(exports.DepotDB, { foreignKey: "depot_id", as: "depot" });
exports.DepotDB.hasMany(exports.MovementDB, { foreignKey: "depot_id", as: "movements", onDelete: "CASCADE", hooks: true });
exports.MovementDB.belongsTo(exports.ProductDB, { foreignKey: "product_id", as: "product" });
exports.ProductDB.hasMany(exports.MovementDB, { foreignKey: "product_id", as: "movements", onDelete: "CASCADE", hooks: true });
exports.UserDB.belongsTo(exports.RolDB, { foreignKey: "rol_id", as: "rol" });
exports.RolDB.hasMany(exports.UserDB, { foreignKey: "rol_id", as: "users" });
exports.PurchaseDB.belongsTo(exports.TypePaymentDB, { foreignKey: "type_payment_id", as: "type_payment" });
exports.TypePaymentDB.hasMany(exports.PurchaseDB, { foreignKey: "type_payment_id", as: "purchases" });
exports.PurchaseDB.belongsTo(exports.ProviderDB, { foreignKey: "provider_id", as: "provider" });
exports.ProviderDB.hasMany(exports.PurchaseDB, { foreignKey: "provider_id", as: "purchases" });
exports.PurchaseDB.belongsTo(exports.UserDB, { foreignKey: "user_ci", as: "user" });
exports.UserDB.hasMany(exports.PurchaseDB, { foreignKey: "user_ci", as: "purchases" });
// Sync
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
