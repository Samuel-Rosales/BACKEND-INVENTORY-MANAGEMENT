// Importa tu modelo 'Permission' (asumo que se llama PermissionDB en tu index)
import { PermissionDB } from "src/models"; 
import { PermissionInterface } from "src/interfaces"; // Ajusta la ruta a tu interfaz

export const permissionSeed = async () => {
    try {
        console.log("Iniciando seed de Permisos...");

        const permissionsToCreate: Omit<PermissionInterface, 'permission_id'>[] = [
            // --- 1. Permisos de Administración (Usuarios y Roles) ---
            {
                code: "create:user",
                name: "Crear Usuarios",
                description: "Permite crear nuevos usuarios en el sistema.",
                status: true
            },
            {
                code: "read:users",
                name: "Ver Usuarios",
                description: "Permite ver la lista de usuarios y sus detalles.",
                status: true
            },
            {
                code: "update:user",
                name: "Actualizar Usuarios",
                description: "Permite modificar la información de usuarios existentes.",
                status: true
            },
            {
                code: "delete:user",
                name: "Eliminar Usuarios",
                description: "Permite eliminar usuarios del sistema.",
                status: true
            },
            {
                code: "manage:roles",
                name: "Gestionar Roles",
                description: "Permite crear, editar, eliminar y asignar permisos a roles.",
                status: true
            },

            // --- 2. Permisos de Productos e Inventario ---
            {
                code: "create:product",
                name: "Crear Productos",
                description: "Permite añadir nuevos productos al inventario.",
                status: true
            },
            {
                code: "read:products",
                name: "Ver Productos",
                description: "Permite ver la lista y detalles de productos.",
                status: true
            },
            {
                code: "update:product",
                name: "Actualizar Productos",
                description: "Permite modificar info (nombre, precio, etc) de productos.",
                status: true
            },
            {
                code: "delete:product",
                name: "Eliminar Productos",
                description: "Permite eliminar productos del inventario.",
                status: true
            },
            {
                code: "read:stock",
                name: "Ver Stock",
                description: "Permite consultar el stock actual en los almacenes.",
                status: true
            },
            {
                code: "adjust:stock",
                name: "Ajustar Stock",
                description: "Permite realizar ajustes manuales de entrada/salida de stock.",
                status: true
            },
            {
                code: "read:movements",
                name: "Ver Movimientos",
                description: "Permite ver el historial de movimientos de inventario (kardex).",
                status: true
            },

            // --- 3. Permisos de Ventas ---
            {
                code: "create:sale",
                name: "Registrar Venta",
                description: "Permite registrar una nueva venta.",
                status: true
            },
            {
                code: "read:sales",
                name: "Ver Ventas",
                description: "Permite ver el historial de ventas.",
                status: true
            },
            {
                code: "cancel:sale",
                name: "Anular Venta",
                description: "Permite anular una venta ya registrada.",
                status: true
            },

            // --- 4. Permisos de Compras ---
            {
                code: "create:purchase",
                name: "Registrar Compra",
                description: "Permite registrar una nueva compra a proveedores.",
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
                description: "Permite anular una compra ya registrada.",
                status: true
            },

            // --- 5. Permisos de Entidades (Clientes, Proveedores, etc.) ---
            {
                code: "create:client",
                name: "Crear Clientes",
                description: "Permite registrar nuevos clientes.",
                status: true
            },
            {
                code: "read:clients",
                name: "Ver Clientes",
                description: "Permite ver la lista de clientes.",
                status: true
            },
            {
                code: "update:client",
                name: "Actualizar Clientes",
                description: "Permite modificar datos de clientes.",
                status: true
            },
            {
                code: "delete:client",
                name: "Eliminar Clientes",
                description: "Permite eliminar clientes.",
                status: true
            },
            {
                code: "create:provider",
                name: "Crear Proveedores",
                description: "Permite registrar nuevos proveedores.",
                status: true
            },
            {
                code: "read:providers",
                name: "Ver Proveedores",
                description: "Permite ver la lista de proveedores.",
                status: true
            },
            {
                code: "update:provider",
                name: "Actualizar Proveedores",
                description: "Permite modificar datos de proveedores.",
                status: true
            },
            {
                code: "delete:provider",
                name: "Eliminar Proveedores",
                description: "Permite eliminar proveedores.",
                status: true
            },

            // --- 6. Permisos de Configuración (Almacenes, Categorías, etc.) ---
            {
                code: "manage:categories",
                name: "Gestionar Categorías",
                description: "Permite crear, editar y eliminar categorías de productos.",
                status: true
            },
            {
                code: "manage:depots",
                name: "Gestionar Almacenes",
                description: "Permite crear, editar y eliminar almacenes (depots).",
                status: true
            },
            {
                code: "manage:paymenttypes",
                name: "Gestionar Tipos de Pago",
                description: "Permite crear, editar y eliminar tipos de pago.",
                status: true
            },
            {
                code: "read:exchangerate",
                name: "Ver Tasa de Cambio",
                description: "Permite ver el historial de la tasa de cambio.",
                status: true
            },

            // --- 7. Permisos de Reportes ---
            {
                code: "view:reports",
                name: "Ver Reportes",
                description: "Permite ver y generar reportes de ventas e inventario.",
                status: true
            },
            {
                code: "all:permissions",
                name: "Todos los Permisos",
                description: "Permite tener todos los permisos del sistema.",
                status: true
            },
        ];

        // --- Lógica de inserción ---

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
        throw error; // Propaga el error para detener la ejecución del seeder principal
    }
};