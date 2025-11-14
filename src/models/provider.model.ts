import { DataTypes, Sequelize } from "sequelize";

export const ProviderFactory = (sequelize: Sequelize) => {
    return sequelize.define("Provider", {
        provider_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        located: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, { tableName: "providers", timestamps: true });
};