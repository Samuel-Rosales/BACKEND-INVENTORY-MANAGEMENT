import {
    Sequelize,
    DataTypes,
    Model,
    // --- 1. IMPORTA LOS TIPOS DE MIXIN ---
    BelongsToManySetAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin
} from "sequelize";

// --- 2. IMPORTA LA INTERFAZ Y LA INSTANCIA del otro modelo ---
import { RolInterface } from "../interfaces"; 
import { PermissionInstance } from "./permission.model"; // <-- ¡Importante!

// --- 3. DEFINE TU ROLINSTANCE ---
// (Probablemente ya tienes esta parte)
export interface RolInstance extends Model<RolInterface>, RolInterface {
    
    // --- 4. AÑADE LOS MÉTODOS "MÁGICOS" AQUÍ ---

    /**
     * Define el tipo para .setPermissions()
     * Acepta un array de Instancias de Permiso (o sus IDs)
     */
    setPermissions: BelongsToManySetAssociationsMixin<PermissionInstance, number>;

    /**
     * Define el tipo para .getPermissions()
     * Devuelve una Promesa con un array de Instancias de Permiso
     */
    getPermissions: BelongsToManyGetAssociationsMixin<PermissionInstance>;
    
    /**
     * Define el tipo para .addPermission()
     * Acepta una sola Instancia de Permiso (o su ID)
     */
    addPermission: BelongsToManyAddAssociationMixin<PermissionInstance, number>;

    // (Puedes añadir también removePermission, hasPermission, etc. si los necesitas)
}

export const RolFactory = (sequelize: Sequelize) => {
    return sequelize.define<RolInstance>("Rol", { // <-- Fíjate que usa <RolInstance>
        rol_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, { tableName: "roles", timestamps: true });
};