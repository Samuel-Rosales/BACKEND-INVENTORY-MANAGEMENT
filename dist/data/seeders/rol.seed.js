"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolSeed = void 0;
const config_1 = require("src/config");
const rolSeed = async () => {
    try {
        console.log("Starting rol seeds...");
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
        const existingRoles = await config_1.RolDB.findAll({
            attributes: ['name']
        });
        const existingNames = existingRoles.map(rol => rol.name);
        // 2. Filtrar el arreglo, manteniendo solo los roles que NO existan
        const uniqueRolesToCreate = rolesToCreate.filter(rol => !existingNames.includes(rol.name));
        // 3. Aplicar las fechas a los roles que serán insertados
        const finalRoles = uniqueRolesToCreate.map(rol => (Object.assign(Object.assign({}, rol), { createdAt: new Date(), updatedAt: new Date() })));
        if (finalRoles.length > 0) {
            // 4. Insertar SOLO los nuevos roles
            const createdRoles = await config_1.RolDB.bulkCreate(finalRoles);
            console.log(`Seed de Roles ejecutado correctamente. Insertados: ${createdRoles.length}`);
        }
        else {
            console.log("Seed de Roles ejecutado. No se insertaron nuevos roles (todos ya existían).");
        }
    }
    catch (error) {
        console.error("Error al ejecutar seed de Roles:", error);
        throw error;
    }
};
exports.rolSeed = rolSeed;
