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
import { RoleInterface } from "../interfaces"; 
import { PermissionInstance } from "./permission.model"; // <-- ¡Importante!

// --- 3. DEFINE TU ROLINSTANCE ---
// (Probablemente ya tienes esta parte)
export interface RoleeInstance extends Model<RoleInterface>, RoleInterface {
    
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

    removePermission(permission: number | PermissionInstance): Promise<void>;
    
    // Para quitar múltiples (el que necesitas)
    removePermissions(permissions: (number | PermissionInstance)[]): Promise<void>;
    // (Puedes añadir también removePermission, hasPermission, etc. si los necesitas)
}

export const RoleeFactory = (sequelize: Sequelize) => {
    return sequelize.define<RoleeInstance>("Rolee", { // <-- Fíjate que usa <RoleeInstance>
        role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        /*status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }*/
    }, { tableName: "roles", timestamps: true });
};