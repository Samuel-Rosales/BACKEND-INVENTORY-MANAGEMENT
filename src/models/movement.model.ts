import { DataTypes, Sequelize } from "sequelize";

export const MovementFactory = (sequelize: Sequelize) => {
    return sequelize.define("Movement", {
        movement_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        depot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('Entrada', 'Salida'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        observation: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        moved_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "movements", timestamps: true });
};