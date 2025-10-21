"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseModel = void 0;
const sequelize_1 = require("sequelize");
exports.PurchaseModel = {
    purchase_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    provider_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    user_ci: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    type_payment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    bought_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Pendiente', 'Aprobado'),
        allowNull: false,
        defaultValue: 'Pendiente',
    },
    active: {
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
