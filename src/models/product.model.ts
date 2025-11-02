import { DataTypes, Sequelize } from "sequelize";

export const ProductFactory = (sequelize: Sequelize) => {
    return sequelize.define("Product", {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        min_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        perishable: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "products", timestamps: true });
};