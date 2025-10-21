import { DataTypes, Sequelize } from "sequelize";

export const ClientFactory = (sequelize: Sequelize) => {
    return sequelize.define("Client", {
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
    }, { tableName: "clients", timestamps: true });
};