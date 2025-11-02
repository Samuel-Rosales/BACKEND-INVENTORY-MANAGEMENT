import { DataTypes, Sequelize } from "sequelize";

export const StockGeneralFactory = (sequelize: Sequelize) => {
    return sequelize.define("StockGeneral", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        depot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "stock_generals", timestamps: true });
};