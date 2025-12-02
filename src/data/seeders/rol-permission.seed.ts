import { RolDB, PermissionDB } from "src/models"; // Ajusta la ruta a tus modelos
import { Op, Model } from "sequelize"; 

// ---- Helper para tipar el Rol con los métodos mágicos de Sequelize ----
interface RolInstance extends Model {
    setPermissions: (permissions: Model[]) => Promise<void>;
    addPermission: (permission: Model) => Promise<void>;
}

export const rolePermissionSeed = async () => {
    try {
        console.log("Iniciando seed de Relaciones Rol-Permiso...");

        // --- Función Helper para buscar permisos y asignarlos al rol ---
        const linkPermissionsToRole = async (roleName: string, permissionCodes: string[]) => {
            const role = await RolDB.findOne({ where: { name: roleName } }) as RolInstance | null;
            
            if (!role) {
                console.warn(`Seed-Relaciones: Rol "${roleName}" no encontrado. Saltando...`);
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

            // Sobreescribe los permisos del rol con los nuevos
            await role.setPermissions(permissions);
            console.log(`Permisos asignados a "${roleName}". (${permissions.length} permisos)`);
        };


        // ==========================================================
        // 1. ROL: Administrador (Super Usuario)
        // ==========================================================
        const adminRole = await RolDB.findOne({ where: { name: "Administrador" } }) as RolInstance | null;
        if (adminRole) {
            const allPermissions = await PermissionDB.findOne({ where: { code: "all:permissions"} });
            
            if (allPermissions) {
                // Usamos setPermissions con un array de 1 para limpiar cualquier otro y dejar solo el 'all'
                await adminRole.setPermissions([allPermissions]); 
                console.log(`Administrador: Permiso "all:permissions" asignado.`);
            } else {
                console.warn('Seed-Relaciones: Permiso "all:permissions" no encontrado. Saltando asignación.');
            }
        }

        // ==========================================================
        // 2. ROL: Gerente (Gestión completa del negocio)
        // ==========================================================
        const managerCodes = [
            // Usuarios y Roles
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
        await linkPermissionsToRole("Gerente", managerCodes);


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
        await linkPermissionsToRole("Operador de Almacén", warehouseCodes);


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
        await linkPermissionsToRole("Cajero", cashierCodes);


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
        await linkPermissionsToRole("Visualizador", viewerCodes);

        console.log("✅ Seed de Relaciones Rol-Permiso ejecutado correctamente.");

    } catch (error) {
        console.error("❌ Error al ejecutar seed de Relaciones Rol-Permiso:", error);
        throw error;
    }
};