import { RolDB, PermissionDB } from "src/models"; // Ajusta la ruta a tus modelos
import { Op } from "sequelize"; // Importante: para hacer búsquedas "IN"

export const rolePermissionSeed = async () => {
    try {
        console.log("Iniciando seed de Relaciones Rol-Permiso...");

        // --- 1. ROL: Administrador (Todos los permisos) ---
        const adminRole = await RolDB.findOne({ where: { name: "Administrador" } });
        const allPermissions = await PermissionDB.findAll();
        
        if (adminRole && allPermissions.length > 0) {
            // .setPermissions() borra las viejas y pone las nuevas
            await adminRole.setPermissions(allPermissions); 
            console.log("Administrador: Todos los permisos asignados.");
        }

        // --- 2. ROL: Gerente (Gestión, pero no de sistema) ---
        const managerRole = await RolDB.findOne({ where: { name: "Gerente" } });
        const managerCodes = [
            "read:users", // Ver usuarios
            "create:product", "read:products", "update:product", "delete:product", // CRUD Productos
            "create:sale", "read:sales", "cancel:sale", // CRUD Ventas
            "view:reports" // Ver Reportes
        ];
        const managerPermissions = await PermissionDB.findAll({
            where: { code: { [Op.in]: managerCodes } }
        });

        if (managerRole) {
            await managerRole.setPermissions(managerPermissions);
            console.log("Gerente: Permisos de gestión asignados.");
        }

        // --- 3. ROL: Operador de Almacén (Solo Inventario) ---
        const warehouseRole = await RolDB.findOne({ where: { name: "Operador de Almacén" } });
        const warehouseCodes = [
            "create:product", "read:products", "update:product" // Solo CRUD de productos
        ];
        const warehousePermissions = await PermissionDB.findAll({
            where: { code: { [Op.in]: warehouseCodes } }
        });

        if (warehouseRole) {
            await warehouseRole.setPermissions(warehousePermissions);
            console.log("Operador de Almacén: Permisos de inventario asignados.");
        }

        // --- 4. ROL: Cajero (Solo Ventas) ---
        const cashierRole = await RolDB.findOne({ where: { name: "Cajero" } });
        const cashierCodes = [
            "read:products", // Necesita ver productos para vender
            "create:sale",   // Registrar venta
            "read:sales"     // Ver sus ventas del día
        ];
        const cashierPermissions = await PermissionDB.findAll({
            where: { code: { [Op.in]: cashierCodes } }
        });
        
        if (cashierRole) {
            await cashierRole.setPermissions(cashierPermissions);
            console.log("Cajero: Permisos de ventas asignados.");
        }

        // --- 5. ROL: Visualizador (Solo Lectura) ---
        const viewerRole = await RolDB.findOne({ where: { name: "Visualizador" } });
        const viewerCodes = [
            "read:users",
            "read:products",
            "read:sales",
            "view:reports"
        ];
        const viewerPermissions = await PermissionDB.findAll({
            where: { code: { [Op.in]: viewerCodes } }
        });

        if (viewerRole) {
            await viewerRole.setPermissions(viewerPermissions);
            console.log("Visualizador: Permisos de solo lectura asignados.");
        }

        console.log("✅ Seed de Relaciones Rol-Permiso ejecutado correctamente.");

    } catch (error) {
        console.error("❌ Error al ejecutar seed de Relaciones Rol-Permiso:", error);
        throw error;
    }
};