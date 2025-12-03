import { RoleDB } from "src/models"; 

export const roleSeed = async () => {
    try {
        console.log("Starting role seeds...");

        // Los roles fundamentales para la aplicación
        const rolesToCreate = [
            {
                name: "Administrador", // ID 1
            },
            {
                name: "Gerente", // ID 2
            },
            {
                name: "Operador de Almacén", // ID 3
            },
            {
                name: "Visualizador", // ID 4
            },
            {
                name: "Cajero", // ID 5
            },
        ];

        // 1. Obtener los nombres de los roles ya existentes en la DB
        // Usamos 'as { name: string }[]' para el tipado, evitando el error de TypeScript
        const existingroles = await RoleDB.findAll({ 
            attributes: ['name'] 
        }); 
        
        const existingNames = existingroles.map(role => (role as any).name);

        // 2. Filtrar el arreglo, manteniendo solo los roles que NO existan
        const uniquerolesToCreate = rolesToCreate.filter(role => 
            !existingNames.includes(role.name)
        );

        // 3. Aplicar las fechas a los roles que serán insertados
        const finalroles = uniquerolesToCreate.map(role => ({
            ...role,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalroles.length > 0) {
            // 4. Insertar SOLO los nuevos roles
            const createdroles = await RoleDB.bulkCreate(finalroles);
            console.log(`Seed de roles ejecutado correctamente. Insertados: ${createdroles.length}`);
        } else {
            console.log("Seed de roles ejecutado. No se insertaron nuevos roles (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de roles:", error);
        throw error;
    }
};