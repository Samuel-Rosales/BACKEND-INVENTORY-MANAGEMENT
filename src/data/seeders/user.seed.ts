import { UserDB } from "src/models";

export const userSeed = async () => {
    try {
        console.log("Iniciando seed de Usuarios...");

        const usersToCreate = [
            {
                user_ci: "31350493",
                name: "Samuel Rosales",
                password: "$2b$10$FFTvkKY/PS7t5cObl9cCAuqayHEUkHl0gxOdx85ZlzdUlSib6EZhy", // Cambia esto por una contraseña segura o hasheada
                role_id: 1, // ID del Role: Administrador
                status: true,
            },
            {
                user_ci: "31366298",
                name: "Edgar Briceño",
                password: "$2b$10$ZdpLb.GOgWk3HiXJyEsie./G/a8u61ph6SuZiDOW5g6AzDmIf82M.",
                role_id: 3, // ID del Role: Operador de Almacén
                status: true,
            },
            {
                user_ci: "31111417",
                name: "Marcos Castellanos",
                password: "$2b$10$ZdpLb.GOgWk3HiXJyEsie./G/a8u61ph6SuZiDOW5g6AzDmIf82M.",
                role_id: 4, // ID del Role: Visualizador
                status: true,
            },
            {
                user_ci: "29778174",
                name: "Jesús Ramos",
                password: "$2b$10$ZdpLb.GOgWk3HiXJyEsie./G/a8u61ph6SuZiDOW5g6AzDmIf82M.",
                role_id: 2, // ID del Role: Gerente
                status: true,
            },
            {
                user_ci: "30665034",
                name: "Anthony Wu Zhang",
                password: "$2b$10$ZdpLb.GOgWk3HiXJyEsie./G/a8u61ph6SuZiDOW5g6AzDmIf82M.",
                role_id: 5, // ID del Role: Visualizador
                status: true,
            },
        ];

        // 1. Obtener las CIs de los usuarios ya existentes en la DB
        const existingUsers = await UserDB.findAll({ 
            attributes: ['user_ci'] 
        }); 
        
        const existingCIs = existingUsers.map(user => (user as any).ci);

        // 2. Filtrar el arreglo, manteniendo solo los usuarios cuyas CIs NO existan
        const uniqueUsersToCreate = usersToCreate.filter(user => 
            !existingCIs.includes(user.user_ci)
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