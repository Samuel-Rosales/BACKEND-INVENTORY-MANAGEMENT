// Importa tu modelo 'Permission' (asumo que se llama PermissionDB en tu index)
import { PermissionDB } from "src/models"; 
import { PermissionInterface } from "src/interfaces"; // Ajusta la ruta a tu interfaz

export const permissionSeed = async () => {
    try {
        console.log("Iniciando seed de Permisos...");

        // Define la lista de permisos que quieres crear
        // Usa el 'code' para tu middleware checkPermission('code')
        const permissionsToCreate: Omit<PermissionInterface, 'permission_id'>[] = [
            // --- Permisos de Usuarios ---
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

            // --- Permisos de Roles y Permisos ---
            {
                code: "manage:roles",
                name: "Gestionar Roles",
                description: "Permite crear, editar, eliminar y asignar permisos a roles.",
                status: true
            },

            // --- Permisos de Productos (Inventario) ---
            {
                code: "create:product",
                name: "Crear Productos",
                description: "Permite añadir nuevos productos al inventario.",
                status: true
            },
            {
                code: "read:products",
                name: "Ver Productos",
                description: "Permite ver la lista y el stock de productos.",
                status: true
            },
            {
                code: "update:product",
                name: "Actualizar Productos",
                description: "Permite modificar la información y el stock de productos.",
                status: true
            },
            {
                code: "delete:product",
                name: "Eliminar Productos",
                description: "Permite eliminar productos del inventario.",
                status: true
            },

            // --- Permisos de Ventas ---
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

            // --- Permisos de Reportes ---
            {
                code: "view:reports",
                name: "Ver Reportes",
                description: "Permite ver y generar reportes de ventas e inventario.",
                status: true
            },
        ];

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
            // (Nota: No añadimos timestamps aquí porque tu modelo Permission tiene 'timestamps: false')
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