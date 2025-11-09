// en /models/tasaDeCambio.model.ts
import { DataTypes, Sequelize } from "sequelize";

export const ExchangeRateFactory = (sequelize: Sequelize) => {
    return sequelize.define("ExchangeRate", {
        rate_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rate: {
            // Guarda con 4 decimales para precisión
            type: DataTypes.DECIMAL(10, 4), 
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY, // Solo la fecha YYYY-MM-DD
            allowNull: false,
            unique: true, // Asegura solo una tasa por día
        }
    }, { 
        tableName: "exchange_rates", 
        timestamps: false // No necesitamos createdAt/updatedAt aquí
    });
};