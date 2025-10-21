import { CategoryDB } from "src/models";

export const categorySeed = async () => {
    try {
        console.log("Iniciando seed de Categorías...");

        const categoriesToCreate = [
            {
                name: "Electrónicos",
                description: "Dispositivos que requieren energía eléctrica, como computadoras y teléfonos.",
                status: true,
            },
            {
                name: "Herramientas",
                description: "Instrumentos utilizados para realizar tareas de construcción, reparación o mantenimiento.",
                status: true,
            },
            {
                name: "Mobiliario",
                description: "Artículos de uso diario como sillas, mesas, estanterías y armarios.",
                status: true,
            },
            {
                name: "Consumibles",
                description: "Suministros que se agotan con el uso, como tinta, papel y baterías.",
                status: true,
            },
            {
                name: "Seguridad",
                description: "Equipos de protección personal (EPP) y sistemas de vigilancia.",
                status: false, // Ejemplo de categoría inactiva inicialmente
            },
        ];

        // 1. Obtener los nombres de las categorías ya existentes en la DB
        // Usamos el casting para que TypeScript reconozca la propiedad 'name'
        const existingCategories = await CategoryDB.findAll({ 
            attributes: ['name'] 
        }); 
        
        const existingNames = existingCategories.map(category => (category as any).name);

        // 2. Filtrar el arreglo, manteniendo solo las categorías que NO existan
        const uniqueCategoriesToCreate = categoriesToCreate.filter(category => 
            !existingNames.includes(category.name)
        );

        // 3. Aplicar las fechas a las categorías que serán insertadas
        const finalCategories = uniqueCategoriesToCreate.map(category => ({
            ...category,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalCategories.length > 0) {
            // 4. Insertar SOLO las nuevas categorías
            const createdCategories = await CategoryDB.bulkCreate(finalCategories);
            console.log(`Seed de Categorías ejecutado correctamente. Insertadas: ${createdCategories.length}`);
        } else {
            console.log("Seed de Categorías ejecutado. No se insertaron nuevas categorías (todas ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Categorías:", error);
        throw error;
    }
};