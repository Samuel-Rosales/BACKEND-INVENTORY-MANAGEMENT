import { DepotDB } from "src/models";

export const depotSeed = async () => {
    try {
        console.log("Starting depot seeds...");

        const depotsToCreate = [
            {
                name: "Almacén Principal",
                location: "Avenida 5, Galpón N° 12, Zona Industrial Norte",
                status: true, // Activo
            },
        ];

        // 1. Obtener los nombres de los depósitos ya existentes en la DB
        const existingDepots = await DepotDB.findAll({ 
            attributes: ['name'] 
        });
        
        const existingNames = existingDepots.map(depot => (depot as any).name);

        // 2. Filtrar el arreglo, manteniendo solo los depósitos que NO existan
        const uniqueDepotsToCreate = depotsToCreate.filter(depot => 
            !existingNames.includes(depot.name)
        );

        // 3. Aplicar las fechas (solo a los depósitos únicos que serán creados)
        const finalDepots = uniqueDepotsToCreate.map(depot => ({
            ...depot,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalDepots.length > 0) {
            // 4. Insertar SOLO los nuevos depósitos
            const createdDepots = await DepotDB.bulkCreate(finalDepots);
            console.log(`Seed de Depósitos ejecutado correctamente. Insertados: ${createdDepots.length}`);
        } else {
            console.log("Seed de Depósitos ejecutado. No se insertaron nuevos depósitos (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Depósitos:", error);
        throw error;
    }
};