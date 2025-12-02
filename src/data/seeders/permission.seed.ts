import { PermissionDB } from "src/models"; 
import { PermissionInterface } from "src/interfaces";

export const permissionSeed = async () => {
    try {
        console.log("Iniciando seed de Permisos...");

        const permissionsToCreate: Omit<PermissionInterface, 'permission_id'>[] = [
            // ==========================================================
            // 1. ADMINISTRACIÓN (Usuarios y Roles)
            // ==========================================================
            {
                code: "manage:users",
                name: "Gestionar Usuarios",
                description: "Permite crear, ver, editar y eliminar usuarios del sistema.",
                status: true
            },
            {
                code: "manage:roles",
                name: "Gestionar Roles",
                description: "Permite crear, editar, eliminar y asignar permisos a roles.",
                status: true
            },

            // ==========================================================
            // 2. PRODUCTOS E INVENTARIO
            // ==========================================================
            {
                code: "create:product",
                name: "Crear Productos",
                description: "Permite registrar nuevos productos en el catálogo.",
                status: true
            },
            {
                code: "read:products",
                name: "Ver Productos",
                description: "Permite ver el catálogo de productos.",
                status: true
            },
            {
                code: "update:product",
                name: "Actualizar Productos",
                description: "Permite editar información de productos (precios, nombres).",
                status: true
            },
            {
                code: "delete:product",
                name: "Eliminar Productos",
                description: "Permite eliminar productos del sistema.",
                status: true
            },
            {
                code: "read:movements",
                name: "Ver Movimientos",
                description: "Permite ver el Kardex o historial de movimientos.",
                status: true
            },
            {
                code: "create:movements",
                name: "Crear Movimientos",
                description: "Permite registrar nuevos movimientos en el Kardex o historial.",
                status: true
            },

            // ==========================================================
            // 3. VENTAS
            // ==========================================================
            {
                code: "create:sale",
                name: "Registrar Venta",
                description: "Permite registrar nuevas ventas.",
                status: true
            },
            {
                code: "confirm:sale", // Corresponde a 'manageSales' en Dart
                name: "Gestionar Ventas",
                description: "Permite confirmar o gestionar ventas.",
                status: true
            },
            {
                code: "read:sales",
                name: "Ver Ventas",
                description: "Permite ver el historial de ventas realizadas.",
                status: true
            },
            {
                code: "cancel:sale",
                name: "Anular Venta",
                description: "Permite anular una venta ya procesada.",
                status: true
            },

            // ==========================================================
            // 4. COMPRAS
            // ==========================================================
            {
                code: "create:purchase",
                name: "Registrar Compra",
                description: "Permite registrar entradas de mercancía por compra a proveedores.",
                status: true
            },
            {
                code: "read:purchases",
                name: "Ver Compras",
                description: "Permite ver el historial de compras.",
                status: true
            },
            {
                code: "cancel:purchase",
                name: "Anular Compra",
                description: "Permite anular una orden de compra.",
                status: true
            },

            // ==========================================================
            // 5. ENTIDADES (Clientes y Proveedores)
            // ==========================================================
            {
                code: "manage:client",
                name: "Gestionar Clientes",
                description: "Control total (Crear, Ver, Editar, Eliminar) sobre clientes.",
                status: true
            },
            {
                code: "manage:provider",
                name: "Gestionar Proveedores",
                description: "Control total (Crear, Ver, Editar, Eliminar) sobre proveedores.",
                status: true
            },

            // ==========================================================
            // 6. CONFIGURACIÓN
            // ==========================================================
            {
                code: "manage:categories",
                name: "Gestionar Categorías",
                description: "Permite administrar categorías de productos.",
                status: true
            },
            {
                code: "manage:depots",
                name: "Gestionar Almacenes",
                description: "Permite administrar depósitos físicos.",
                status: true
            },
            {
                code: "manage:paymenttypes",
                name: "Gestionar Tipos de Pago",
                description: "Permite administrar los tipos de pago disponibles.",
                status: true
            },
            // Comentado en Dart, lo comento aquí también para mantener consistencia
            // {
            //     code: "read:exchangerate",
            //     name: "Ver Tasa de Cambio",
            //     description: "Ver historial de tasa de cambio.",
            //     status: true
            // },

            // ==========================================================
            // 7. REPORTES Y SUPER ADMIN
            // ==========================================================
            {
                code: "read:reports",
                name: "Ver Reportes",
                description: "Acceso al Dashboard de reportes y estadísticas.",
                status: true
            },
            {
                code: "all:permissions",
                name: "Super Admin",
                description: "Permiso maestro. Tiene acceso a todo sin restricciones.",
                status: true
            },
        ];

        // --- Lógica de inserción (Sin cambios) ---

        // 1. Obtener los 'codes' de los permisos ya existentes
        const existingPermissions = await PermissionDB.findAll({ 
            attributes: ['code'] 
        }); 
        
        // Mapea a un array de strings (los 'codes')
        const existingCodes = existingPermissions.map(perm => (perm as any).code);

        // 2. Filtrar el arreglo, manteniendo solo los permisos cuyos 'code' NO existan
        const uniquePermissionsToCreate = permissionsToCreate.filter(perm => 
            !existingCodes.includes(perm.code)
        );

        // 3. Insertar SOLO los nuevos permisos
        if (uniquePermissionsToCreate.length > 0) {
            const createdPermissions = await PermissionDB.bulkCreate(uniquePermissionsToCreate);
            console.log(`Seed de Permisos ejecutado correctamente. Insertados: ${createdPermissions.length}`);
        } else {
            console.log("Seed de Permisos ejecutado. No se insertaron nuevos permisos (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Permisos:", error);
        throw error; 
    }
};