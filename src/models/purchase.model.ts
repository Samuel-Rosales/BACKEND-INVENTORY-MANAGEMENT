import { DataTypes } from "sequelize";

export const PurchaseModel = {
    purchase_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_ci: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    type_payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bought_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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