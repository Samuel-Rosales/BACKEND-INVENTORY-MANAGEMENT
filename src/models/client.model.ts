import { DataTypes } from "sequelize";

export const ClientModel = {
    client_ci: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(12)
    },
    address: {
        type: DataTypes.STRING(255),
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