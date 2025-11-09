import { Sequelize, DataTypes, Model } from "sequelize";
import { PermissionInterface } from "../interfaces"; // Ajusta la ruta si es necesario

// Esta interfaz ya la tienes y está correcta
export interface PermissionInstance extends Model<PermissionInterface>, PermissionInterface {}

// --- TU FÁBRICA DE MODELO (AQUÍ ESTÁ EL ARREGLO) ---
export const PermissionFactory = (sequelize: Sequelize) => {
    
    // V---- ¡AÑADE <PermissionInstance> AQUÍ!
    return sequelize.define<PermissionInstance>("Permission", {
        permission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(100), 
            allowNull: false,
            unique: true, 
        },
        name: {
            type: DataTypes.STRING(255), 
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, 
        },
    }, { tableName: "permissions", timestamps: false });
};