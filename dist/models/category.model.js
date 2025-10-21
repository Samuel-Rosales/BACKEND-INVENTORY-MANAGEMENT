"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryFactory = void 0;
const sequelize_1 = require("sequelize");
const CategoryFactory = (sequelize) => {
    return sequelize.define("Category", {
        category_id: {
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
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "categories", timestamps: true });
};
exports.CategoryFactory = CategoryFactory;
