"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolFactory = void 0;
const sequelize_1 = require("sequelize");
const RolFactory = (sequelize) => {
    return sequelize.define("Rol", {
        rol_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    }, { tableName: "roles", timestamps: true });
};
exports.RolFactory = RolFactory;
