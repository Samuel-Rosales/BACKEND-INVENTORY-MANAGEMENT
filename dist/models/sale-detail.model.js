"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleDetailFactory = void 0;
const sequelize_1 = require("sequelize");
const SaleDetailFactory = (sequelize) => {
    return sequelize.define("SaleDetail", {
        sale_detail_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        sale_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        unit_cost: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },
        amount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "sales_details", timestamps: true });
};
exports.SaleDetailFactory = SaleDetailFactory;
