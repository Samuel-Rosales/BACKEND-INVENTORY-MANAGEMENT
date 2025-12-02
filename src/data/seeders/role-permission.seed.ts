import { RoleeDB, PermissionDB } from "src/models"; // Ajusta la ruta a tus modelos
import { Op, Model } from "sequelize"; 

// ---- Helper para tipar el Rolee con los métodos mágicos de Sequelize ----
interface RoleInstance extends Model {
    setPermissions: (permissions: Model[]) => Promise<void>;
    addPermission: (permission: Model) => Promise<void>;
}

export const rolePermissionSeed = async () => {
    try {
        console.log("Iniciando seed de Relaciones Rolee-Permiso...");

        // --- Función Helper para buscar permisos y asignarlos al role ---
        const linkPermissionsToRolee = async (roleName: string, permissionCodes: string[]) => {
            const role = await RoleeDB.findOne({ where: { name: roleName } }) as RoleInstance | null;
            
            if (!role) {
                console.warn(`Seed-Relaciones: Rolee "${roleName}" no encontrado. Saltando...`);
                return;
            }

            // Buscamos todos los permisos que coincidan con los códigos
            const permissions = await PermissionDB.findAll({
                where: { code: { [Op.in]: permissionCodes } }
            });

            // Validación opcional: avisar si falta alguno en la DB
            if (permissions.length !== permissionCodes.length) {
                console.warn(`Seed-Relaciones: Se esperaban ${permissionCodes.length} permisos para "${roleName}", pero se encontraron ${permissions.length}. Revisa si los códigos existen en PermissionDB.`);
            }

            // Sobreescribe los permisos del role con los nuevos
            await role.setPermissions(permissions);
            console.log(`Permisos asignados a "${roleName}". (${permissions.length} permisos)`);
        };


        // ==========================================================
        // 1. ROL: Administrador (Super Usuario)
        // ==========================================================
        const adminRolee = await RoleeDB.findOne({ where: { name: "Administrador" } }) as RoleInstance | null;
        if (adminRolee) {
            const allPermissions = await PermissionDB.findOne({ where: { code: "all:permissions"} });
            
            if (allPermissions) {
                // Usamos setPermissions con un array de 1 para limpiar cualquier otro y dejar solo el 'all'
                await adminRolee.setPermissions([allPermissions]); 
                console.log(`Administrador: Permiso "all:permissions" asignado.`);
            } else {
                console.warn('Seed-Relaciones: Permiso "all:permissions" no encontrado. Saltando asignación.');
            }
        }

        // ==========================================================
        // 2. ROL: Gerente (Gestión completa del negocio)
        // ==========================================================
        const managerCodes = [
            // Usuarios y Rolees
            "manage:users", 
            // "manage:roles", // Generalmente solo el Admin gestiona roles, pero puedes descomentarlo si el gerente también.

            // Productos (CRUD completo + Movimientos)
            "create:product", "read:products", "update:product", "delete:product",
            "read:movements", "create:movements",

            // Ventas (Gestión total)
            "create:sale", "confirm:sale", "read:sales", "cancel:sale",

            // Compras (Gestión total)
            "create:purchase", "read:purchases", "cancel:purchase",

            // Entidades (Gestión total unificada)
            "manage:client", "manage:provider",

            // Configuración
            "manage:categories", "manage:depots", "manage:paymenttypes", 
            
            // Reportes
            "read:reports"
        ];
        await linkPermissionsToRolee("Gerente", managerCodes);


        // ==========================================================
        // 3. ROL: Operador de Almacén
        // ==========================================================
        const warehouseCodes = [
            // Productos (Puede crear/editar, pero NO borrar)
            "create:product", "read:products", "update:product",
            
            // Inventario
            "read:movements",

            // Compras (Para registrar entradas)
            "create:purchase", "read:purchases",

            // Configuración (Necesario para organizar stock)
            "manage:categories", "manage:depots"
        ];
        await linkPermissionsToRolee("Operador de Almacén", warehouseCodes);


        // ==========================================================
        // 4. ROL: Cajero
        // ==========================================================
        const cashierCodes = [
            // Productos (Solo lectura)
            "read:products",
            
            // Ventas (Registrar y ver historial)
            "create:sale", "read:sales",

            // Clientes (Necesita 'manage' para poder crearlos al vender)
            "manage:client" 
        ];
        await linkPermissionsToRolee("Cajero", cashierCodes);


        // ==========================================================
        // 5. ROL: Visualizador
        // ==========================================================
        const viewerCodes = [
            // Solo permisos de LECTURA explícitos.
            // Nota: No incluimos 'manage:users' o 'manage:client' porque 
            // eso daría permisos de borrar/editar.
            "read:products",
            "read:movements",
            "read:sales",
            "read:purchases",
            "read:reports"
        ];
        await linkPermissionsToRolee("Visualizador", viewerCodes);

        console.log("✅ Seed de Relaciones Rolee-Permiso ejecutado correctamente.");

    } catch (error) {
        console.error("❌ Error al ejecutar seed de Relaciones Rolee-Permiso:", error);
        throw error;
    }
};