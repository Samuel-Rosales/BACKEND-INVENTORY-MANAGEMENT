import { DataTypes, Sequelize } from "sequelize";

export const RolFactory = (sequelize: Sequelize) => {
    return sequelize.define("Rol", {
        rol_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    }, { tableName: "roles", timestamps: true });
};