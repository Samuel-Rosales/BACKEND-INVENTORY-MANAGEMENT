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
        total_usd: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        exchange_rate: {
            type: DataTypes.DECIMAL(10, 4), // La tasa exacta usada en esta venta
            allowNull: false
        },
        total_ves: {
            type: DataTypes.DECIMAL(10, 2), // El total en Bs. calculado
            allowNull: false
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