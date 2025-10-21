"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotFactory = void 0;
const sequelize_1 = require("sequelize");
const DepotFactory = (sequelize) => {
    return sequelize.define("Depot", {
        depot_id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "depots", timestamps: true });
};
exports.DepotFactory = DepotFactory;
