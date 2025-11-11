import { RolDB, PermissionDB } from "src/models"; // Ajusta la ruta a tus modelos
import { Op } from "sequelize"; // Importante: para hacer búsquedas "IN"
import { Model } from "sequelize"; // Necesario para tipar la función helper

// ---- Helper para tipar el Rol con la función 'setPermissions' ----
// (Esto es opcional pero mejora la legibilidad y el autocompletado)
interface RolInstance extends Model {
    setPermissions: (permissions: Model[]) => Promise<void>;
}

export const rolePermissionSeed = async () => {
    try {
        console.log("Iniciando seed de Relaciones Rol-Permiso...");

        // --- Función Helper para no repetir código ---
        const linkPermissionsToRole = async (roleName: string, permissionCodes: string[]) => {
            const role = await RolDB.findOne({ where: { name: roleName } }) as RolInstance | null;
            
            if (!role) {
                console.warn(`Seed-Relaciones: Rol "${roleName}" no encontrado. Saltando...`);
                return;
            }

            const permissions = await PermissionDB.findAll({
                where: { code: { [Op.in]: permissionCodes } }
            });

            if (permissions.length !== permissionCodes.length) {
                console.warn(`Seed-Relaciones: No se encontraron todos los permisos para "${roleName}".`);
            }

            await role.setPermissions(permissions);
            console.log(`Permisos asignados a "${roleName}". (${permissions.length} permisos)`);
        };
        // ---------------------------------------------


        // --- 1. ROL: Administrador (Todos los permisos) ---
        const adminRole = await RolDB.findOne({ where: { name: "Administrador" } }) as RolInstance | null;
        if (adminRole) {
            const allPermissions = await PermissionDB.findOne({ where: { code: "all:permissions"} });
            
            if (allPermissions) {
                // --- CORRECCIÓN AQUÍ ---
                // Usa el método de asociación, no .set()
                await (adminRole as any).addPermission(allPermissions); 
                // (Nota: El método podría ser "addPermissions" (plural) si el alias es así)
                
                console.log(`Administrador: Permiso "all:permissions" asignado.`);
            } else {
                console.warn('Seed-Relaciones: Permiso "all:permissions" no encontrado. Saltando asignación.');
            }
        }

        // --- 2. ROL: Gerente (Gestión completa del negocio) ---
        const managerCodes = [
            // Usuarios (No puede gestionar roles, pero sí usuarios)
            "create:user", "read:users", "update:user", "delete:user",
            // Productos (CRUD completo)
            "create:product", "read:products", "update:product", "delete:product",
            // Inventario (Gestión completa)
            "read:stock", "adjust:stock", "read:movements",
            // Ventas (CRUD completo)
            "create:sale", "read:sales", "cancel:sale",
            // Compras (CRUD completo)
            "create:purchase", "read:purchases", "cancel:purchase",
            // Entidades (CRUD completo)
            "create:client", "read:clients", "update:client", "delete:client",
            "create:provider", "read:providers", "update:provider", "delete:provider",
            // Configuración (Toda)
            "manage:categories", "manage:depots", "manage:paymenttypes", "read:exchangerate",
            // Reportes
            "view:reports"
        ];
        await linkPermissionsToRole("Gerente", managerCodes);

        // --- 3. ROL: Operador de Almacén (Inventario y Compras) ---
        const warehouseCodes = [
            // Productos (Puede crear, ver y actualizar, pero no borrar)
            "create:product", "read:products", "update:product",
            // Inventario (Su función principal)
            "read:stock", "adjust:stock", "read:movements",
            // Compras (Recepción de mercancía)
            "create:purchase", "read:purchases",
            // Entidades (Solo ver proveedores)
            "read:providers",
            // Configuración (Ver categorías y almacenes)
            "manage:categories", "manage:depots",
        ];
        await linkPermissionsToRole("Operador de Almacén", warehouseCodes);

        // --- 4. ROL: Cajero (Punto de venta) ---
        const cashierCodes = [
            // Productos (Necesita ver productos y stock)
            "read:products",
            "read:stock",
            // Ventas (Su función principal)
            "create:sale", 
            "read:sales", // Ver sus propias ventas
            // Entidades (Registrar y buscar clientes)
            "create:client",
            "read:clients",
            // Configuración (Ver la tasa del día)
            "read:exchangerate"
        ];
        await linkPermissionsToRole("Cajero", cashierCodes);

        // --- 5. ROL: Visualizador (Solo Lectura de todo) ---
        const viewerCodes = [
            "read:users",
            "read:products",
            "read:stock",
            "read:movements",
            "read:sales",
            "read:purchases",
            "read:clients",
            "read:providers",
            "read:exchangerate",
            "view:reports"
        ];
        await linkPermissionsToRole("Visualizador", viewerCodes);

        console.log("✅ Seed de Relaciones Rol-Permiso ejecutado correctamente.");

    } catch (error) {
        console.error("❌ Error al ejecutar seed de Relaciones Rol-Permiso:", error);
        throw error;
    }
};