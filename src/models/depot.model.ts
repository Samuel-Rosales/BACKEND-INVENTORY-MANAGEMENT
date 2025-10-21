import { DataTypes, Sequelize } from "sequelize";

export const DepotFactory = (sequelize: Sequelize) => {
    return sequelize.define("Depot", {
        depot_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, { tableName: "depots", timestamps: true });
};