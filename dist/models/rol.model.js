"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolModel = void 0;
const sequelize_1 = require("sequelize");
exports.RolModel = {
    rol_id: {
        type: sequelize_1.DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
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
