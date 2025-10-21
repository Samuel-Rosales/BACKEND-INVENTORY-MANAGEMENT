import { ProductDB } from "src/config";

export const productSeed = async () => {
    try {
        console.log("Iniciando seed de Productos...");

        const productsToCreate = [
            // Productos Electrónicos (Category ID: 1)
            {
                name: "Laptop HP ProBook",
                description: "Portátil de gama media para uso profesional.",
                category_id: 1, 
                base_price: 850.50,
                min_stock: 5,
                stock: 12, // <-- Campo 'stock' agregado
                status: true,
            },
            {
                name: "Monitor LED 24 pulgadas",
                description: "Monitor Full HD con puerto HDMI y bajo consumo energético.",
                category_id: 1, 
                base_price: 189.75,
                min_stock: 7,
                stock: 25, // <-- Campo 'stock' agregado
                status: true,
            },
            
            // Productos Herramientas (Category ID: 2)
            {
                name: "Martillo de Uña 20oz",
                description: "Martillo estándar para trabajos de carpintería.",
                category_id: 2, 
                base_price: 15.00,
                min_stock: 20,
                stock: 55, // <-- Campo 'stock' agregado
                status: true,
            },
            {
                name: "Destornillador Phillips N°2",
                description: "Juego de 5 destornilladores de precisión con punta magnética.",
                category_id: 2, 
                base_price: 12.90,
                min_stock: 35,
                stock: 75, // <-- Campo 'stock' agregado
                status: true,
            },

            // Productos Mobiliario (Category ID: 3)
            {
                name: "Silla Ergonómica Ejecutiva",
                description: "Silla de oficina con soporte lumbar ajustable y malla transpirable.",
                category_id: 3, 
                base_price: 150.99,
                min_stock: 10,
                stock: 18, // <-- Campo 'stock' agregado
                status: true,
            },
            {
                name: "Archivador de Metal 3 Gavetas",
                description: "Archivador metálico con cerradura centralizada.",
                category_id: 3, 
                base_price: 95.50,
                min_stock: 5,
                stock: 10, // <-- Campo 'stock' agregado
                status: true,
            },

            // Productos Consumibles (Category ID: 4)
            {
                name: "Resma de Papel Carta",
                description: "Papel blanco de 75g/m2, 500 hojas.",
                category_id: 4, 
                base_price: 5.25,
                min_stock: 50,
                stock: 120, // <-- Campo 'stock' agregado
                status: true,
            },
            {
                name: "Toner Negro LaserJet",
                description: "Cartucho de toner de alto rendimiento, compatible con modelo 4000 series.",
                category_id: 4, 
                base_price: 45.00,
                min_stock: 15,
                stock: 30, // <-- Campo 'stock' agregado
                status: true,
            },

            // Productos Seguridad (Category ID: 5)
            {
                name: "Guantes de Seguridad Nitrilo",
                description: "Guantes industriales de nitrilo, caja de 100 unidades.",
                category_id: 5, 
                base_price: 18.00,
                min_stock: 40,
                stock: 80, // <-- Campo 'stock' agregado
                status: true,
            },
        ];

        // 1. Obtener los nombres de los productos ya existentes en la DB
        const existingProducts = await ProductDB.findAll({ 
            attributes: ['name'] 
        }); 
        
        const existingNames = existingProducts.map(product => (product as any).name);

        // 2. Filtrar el arreglo, manteniendo solo los productos cuyos nombres NO existan
        const uniqueProductsToCreate = productsToCreate.filter(product => 
            !existingNames.includes(product.name)
        );

        // 3. Aplicar las fechas a los productos que serán insertados
        const finalProducts = uniqueProductsToCreate.map(product => ({
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalProducts.length > 0) {
            // 4. Insertar SOLO los nuevos productos
            const createdProducts = await ProductDB.bulkCreate(finalProducts);
            console.log(`Seed de Productos ejecutado correctamente. Insertados: ${createdProducts.length}`);
        } else {
            console.log("Seed de Productos ejecutado. No se insertaron nuevos productos (todos ya existían).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Productos:", error);
        throw error;
    }
};