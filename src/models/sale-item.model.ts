import { DataTypes, Sequelize } from "sequelize";

export const SaleItemFactory = (sequelize: Sequelize) => {
    return sequelize.define("SaleItem", {
        sale_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sale_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        depot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price_usd: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },
        unit_price_bs: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "sales_items", timestamps: true });
};