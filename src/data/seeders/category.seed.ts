import { CategoryDB } from "src/models";

export const categorySeed = async () => {
    try {
        console.log("Iniciando seed de Categorías...");

        const categoriesToCreate = [
            {
                name: "Alimentos Básicos",
                description: "Productos esenciales para la alimentación diaria, como arroz, frijoles y harina.",
                status: true,
            },
            {
                name: "Higiene Personal y Cuidado",
                description: "Productos para el cuidado personal diario, como jabón, champú y pasta dental.",
                status: true,
            },
            {
                name: "Limpieza Básica",
                description: "Productos para la limpieza del hogar, como detergentes, desinfectantes y esponjas.",
                status: true,
            },
            {
                name: "Herramientas Básicas",
                description: "Herramientas manuales esenciales para reparaciones y mantenimiento del hogar.",
                status: true,
            },
            {
                name: "Ferretería básica",
                description: "Suministros y materiales esenciales para reparaciones y proyectos de bricolaje en el hogar.",
                status: true, // Ejemplo de categoría inactiva inicialmente
            },
            {
                name: "Muebles Básicos",
                description: "Muebles esenciales para el hogar, como sillas, mesas y estanterías.",
                status: true, // Ejemplo de categoría inactiva inicialmente
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