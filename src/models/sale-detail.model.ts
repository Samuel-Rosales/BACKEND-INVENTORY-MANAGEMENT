import { DataTypes } from "sequelize";

export const SaleDetailModel = {
    sale_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sale_id: {
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
};