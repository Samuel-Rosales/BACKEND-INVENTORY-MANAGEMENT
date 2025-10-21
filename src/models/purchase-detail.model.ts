import { DataTypes, Sequelize } from "sequelize";

export const PurchaseDetailFactory = (sequelize: Sequelize) => {
    return sequelize.define("PurchaseDetail", {
        purchase_detail_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purchase_id: {
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
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "purchases_details", timestamps: true });
};