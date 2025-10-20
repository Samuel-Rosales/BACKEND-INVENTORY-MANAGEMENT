import { DataTypes } from "sequelize";

export const UserModel = {
    ci: {
        type: DataTypes.STRING(10), // Ej: "12345678"
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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