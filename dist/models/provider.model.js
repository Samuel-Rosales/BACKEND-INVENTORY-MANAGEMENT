"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFactory = void 0;
const sequelize_1 = require("sequelize");
const ProviderFactory = (sequelize) => {
    return sequelize.define("Provider", {
        provider_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        located: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
    }, { tableName: "providers", timestamps: true });
};
exports.ProviderFactory = ProviderFactory;
