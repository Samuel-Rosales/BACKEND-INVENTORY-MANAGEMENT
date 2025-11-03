import { DataTypes, Sequelize } from "sequelize";

export const PurchaseLotItemFactory = (sequelize: Sequelize) => {
    return sequelize.define("PurchaseLotItem", {
        purchase_lot_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purchase_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        depot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_cost: {
            type: DataTypes.DECIMAL(10, 2),
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
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "purchase_lot_items", timestamps: true });
};