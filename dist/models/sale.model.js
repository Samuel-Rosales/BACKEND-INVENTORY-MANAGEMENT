"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleFactory = void 0;
const sequelize_1 = require("sequelize");
const SaleFactory = (sequelize) => {
    return sequelize.define("Sale", {
        sale_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        client_ci: {
            type: sequelize_1.DataTypes.STRING(10),
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
        sold_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "sales", timestamps: true });
};
exports.SaleFactory = SaleFactory;
