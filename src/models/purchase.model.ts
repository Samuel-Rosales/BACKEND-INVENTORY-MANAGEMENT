import { DataTypes, Sequelize } from "sequelize";

export const PurchaseFactory = (sequelize: Sequelize) => {
    return sequelize.define("Purchase", {
        purchase_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        provider_id: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.DECIMAL(10, 4), // La tasa exacta usada en esta compra
            allowNull: false
        },
        total_ves: {
            type: DataTypes.DECIMAL(10, 2), // El total en Bs. calculado
            allowNull: false
        },
        bought_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('Pendiente', 'Aprobado'),
            allowNull: false,
            defaultValue: 'Pendiente',
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "purchases", timestamps: true });
};