import { DataTypes, Sequelize } from "sequelize";

export const StockLotFactory = (sequelize: Sequelize) => {
    return sequelize.define("StockLot", {
        stock_lot_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
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
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cost_lot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "stock_lots", timestamps: true });
};