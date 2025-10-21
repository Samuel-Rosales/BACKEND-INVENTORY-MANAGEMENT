"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const sequelize_1 = require("sequelize");
const UserFactory = (sequelize) => {
    return sequelize.define("User", {
        ci: {
            type: sequelize_1.DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        rol_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, { tableName: "users", timestamps: true });
};
exports.UserFactory = UserFactory;
