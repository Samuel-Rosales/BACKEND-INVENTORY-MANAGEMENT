import { DataTypes, Sequelize } from "sequelize";

export const SaleFactory = (sequelize: Sequelize) => {
    return sequelize.define("Sale", {
        sale_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        client_ci: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        user_ci: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        type_payment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sold_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "sales", timestamps: true });
};