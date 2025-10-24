"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFactory = void 0;
const sequelize_1 = require("sequelize");
const ProductFactory = (sequelize) => {
    return sequelize.define("Product", {
        product_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        category_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        base_price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        image_url: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        min_stock: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "products", timestamps: true });
};
exports.ProductFactory = ProductFactory;
