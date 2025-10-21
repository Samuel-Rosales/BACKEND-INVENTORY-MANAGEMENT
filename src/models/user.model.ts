import { DataTypes, Sequelize } from "sequelize";

export const UserFactory = (sequelize: Sequelize) => {
    return sequelize.define("User", {
        ci: {
            type: DataTypes.STRING(10),
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
    }, { tableName: "users", timestamps: true });
};