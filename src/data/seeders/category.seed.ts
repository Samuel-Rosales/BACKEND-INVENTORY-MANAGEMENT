import { CategoryDB } from "src/models";

export const categorySeed = async () => {
    try {
        console.log("🏪 Iniciando seed de Categorías (Bodega)...");

        const categoriesToCreate = [
            // ID 1: Coincide con Harina, Arroz, etc.
            {
                name: "Alimentos Básicos",
                description: "Productos esenciales de la canasta alimentaria: Harinas, arroz, pasta, aceites y margarina.",
                status: true,
            },
            // ID 2: Coincide con Jabón, Champú, etc.
            {
                name: "Higiene Personal",
                description: "Artículos para el aseo y cuidado personal diario.",
                status: true,
            },
            // ID 3: Coincide con Cloro, Detergente.
            {
                name: "Limpieza del Hogar",
                description: "Productos para el mantenimiento, desinfección y limpieza de superficies.",
                status: true,
            },
            // ID 4: NUEVA - Coincide con Pepitos, Galletas, Chocolates.
            {
                name: "Golosinas y Snacks",
                description: "Dulces, galletas, chocolates y snacks salados para la merienda.",
                status: true,
            },
            // ID 5: NUEVA - Coincide con Refrescos, Malta, Agua.
            {
                name: "Bebidas y Refrescos",
                description: "Bebidas gaseosas, jugos, malta y agua mineral.",
                status: true,
            },
        ];

        // 1. Verificar existentes
        const existingCategories = await CategoryDB.findAll({ 
            attributes: ['name'] 
        }); 
        
        const existingNames = new Set(existingCategories.map(category => (category as any).name));

        // 2. Filtrar nuevas
        const uniqueCategoriesToCreate = categoriesToCreate.filter(category => 
            !existingNames.has(category.name)
        );

        // 3. Preparar datos
        const finalCategories = uniqueCategoriesToCreate.map(category => ({
            ...category,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalCategories.length > 0) {
            // 4. Insertar
            const createdCategories = await CategoryDB.bulkCreate(finalCategories);
            console.log(`✅ ${createdCategories.length} Categorías de bodega insertadas.`);
        } else {
            console.log("ℹ️ No hay categorías nuevas por insertar.");
        }

    } catch (error) {
        console.error("❌ Error seed Categorías:", error);
        throw error;
    }
};