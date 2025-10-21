import { UserDB } from "src/models";

export const userSeed = async () => {
    try {
        console.log("Iniciando seed de Usuarios...");

        const usersToCreate = [
            {
                ci: "31350493",
                name: "Samuel Rosales",
                rol_id: 1, // ID del Rol: Administrador
                status: true,
            },
            {
                ci: "31366298",
                name: "Edgar Briceño",
                rol_id: 3, // ID del Rol: Operador de Almacén
                status: true,
            },
            {
                ci: "31111417",
                name: "Marcos Castellanos",
                rol_id: 4, // ID del Rol: Visualizador
                status: true,
            },
            {
                ci: "29778174",
                name: "Jesús Ramos",
                rol_id: 2, // ID del Rol: Gerente
                status: true,
            },
            {
                ci: "30665034",
                name: "Anthony Wu Zhang",
                rol_id: 5, // ID del Rol: Visualizador
                status: true,
            },
        ];

        // 1. Obtener las CIs de los usuarios ya existentes en la DB
        const existingUsers = await UserDB.findAll({ 
            attributes: ['ci'] 
        }); 
        
        const existingCIs = existingUsers.map(user => (user as any).ci);

        // 2. Filtrar el arreglo, manteniendo solo los usuarios cuyas CIs NO existan
        const uniqueUsersToCreate = usersToCreate.filter(user => 
            !existingCIs.includes(user.ci)
        );

        // 3. Aplicar las fechas a los usuarios que serán insertados
        const finalUsers = uniqueUsersToCreate.map(user => ({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalUsers.length > 0) {
            // 4. Insertar SOLO los nuevos usuarios
            const createdUsers = await UserDB.bulkCreate(finalUsers);
            console.log(`Seed de Usuarios ejecutado correctamente. Insertados: ${createdUsers.length}`);
        } else {
            console.log("Seed de Usuarios ejecutado. No se insertaron nuevos usuarios (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Usuarios:", error);
        throw error;
    }
};