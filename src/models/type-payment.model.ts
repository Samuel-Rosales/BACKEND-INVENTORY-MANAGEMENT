import { DataTypes, Sequelize } from "sequelize";

export const TypePaymentFactory = (sequelize: Sequelize) => {
    return sequelize.define("TypePayment", {
        type_payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    }, { tableName: "types_payments", timestamps: true });
};