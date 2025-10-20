"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModel = void 0;
const sequelize_1 = require("sequelize");
exports.ClientModel = {
    client_ci: {
        type: sequelize_1.DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(12)
    },
    address: {
        type: sequelize_1.DataTypes.STRING(255),
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
