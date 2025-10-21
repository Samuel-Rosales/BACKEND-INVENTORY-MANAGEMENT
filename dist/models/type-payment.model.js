"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypePaymentFactory = void 0;
const sequelize_1 = require("sequelize");
const TypePaymentFactory = (sequelize) => {
    return sequelize.define("TypePayment", {
        type_payment_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    }, { tableName: "types_payments", timestamps: true });
};
exports.TypePaymentFactory = TypePaymentFactory;
