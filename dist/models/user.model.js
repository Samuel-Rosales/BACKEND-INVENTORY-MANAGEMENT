"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
exports.UserModel = {
    ci: {
        type: sequelize_1.DataTypes.STRING(10), // Ej: "12345678"
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    rol_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
};
