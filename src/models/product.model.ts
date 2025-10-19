import { DataTypes } from "sequelize";

export const ProductModel = {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    min_stock: {
        type: DataTypes.INTEGER(),
        allowNull: false,
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