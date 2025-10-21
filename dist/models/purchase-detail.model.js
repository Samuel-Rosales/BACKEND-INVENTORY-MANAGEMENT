"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDetailFactory = void 0;
const sequelize_1 = require("sequelize");
const PurchaseDetailFactory = (sequelize) => {
    return sequelize.define("PurchaseDetail", {
        purchase_detail_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        purchase_id: {
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
    }, { tableName: "purchases_details", timestamps: true });
};
exports.PurchaseDetailFactory = PurchaseDetailFactory;
