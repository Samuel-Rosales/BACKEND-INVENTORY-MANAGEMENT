// src/data/seeders/product.seed.ts
import { ProductDB, CategoryDB } from "src/models";

export const productSeed = async () => {
    try {
        console.log("Iniciando seed de Productos...");

        const productsToCreate = [
            // Categoria 1: Electrónicos
            {
                name: "Laptop HP ProBook",
                description: "Portátil de gama media para uso profesional.",
                category_id: 1, 
                base_price: 850.50,    // <-- CORREGIDO
                min_stock: 5,         // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            {
                name: "Monitor LED 24 pulgadas",
                description: "Monitor Full HD con puerto HDMI y bajo consumo energético.",
                category_id: 1, 
                base_price: 189.75,   // <-- CORREGIDO
                min_stock: 7,         // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            
            // Categoria 2: Herramientas
            {
                name: "Martillo de Uña 20oz",
                description: "Martillo estándar para trabajos de carpintería.",
                category_id: 2, 
                base_price: 15.00,    // <-- CORREGIDO
                min_stock: 20,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            {
                name: "Destornillador Phillips N°2",
                description: "Juego de 5 destornilladores de precisión con punta magnética.",
                category_id: 2, 
                base_price: 12.90,    // <-- CORREGIDO
                min_stock: 35,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },

            // Categoria 3: Mobiliario
            {
                name: "Silla Ergonómica Ejecutiva",
                description: "Silla de oficina con soporte lumbar ajustable y malla transpirable.",
                category_id: 3, 
                base_price: 150.99,   // <-- CORREGIDO
                min_stock: 10,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            {
                name: "Archivador de Metal 3 Gavetas",
                description: "Archivador metálico con cerradura centralizada.",
                category_id: 3, 
                base_price: 95.50,    // <-- CORREGIDO
                min_stock: 5,         // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },

            // Categoria 4: Consumibles
            {
                name: "Resma de Papel Carta",
                description: "Papel blanco de 75g/m2, 500 hojas.",
                category_id: 4, 
                base_price: 5.25,     // <-- CORREGIDO
                min_stock: 50,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            {
                name: "Toner Negro LaserJet",
                description: "Cartucho de toner de alto rendimiento, compatible con modelo 4000 series.",
                category_id: 4, 
                base_price: 45.00,    // <-- CORREGIDO
                min_stock: 15,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
            { 
                name: "Baterías AAA (Paquete 4)",
                description: "Baterías alcalinas AAA, paquete de 4.",
                category_id: 4, 
                base_price: 3.50,     // <-- CORREGIDO
                min_stock: 30,        // <-- CORREGIDO
                perishable: true,   // <-- CORREGIDO
                status: true,
            },

            // Categoria 5: Seguridad
            {
                name: "Guantes de Seguridad Nitrilo",
                description: "Guantes industriales de nitrilo, caja de 100 unidades.",
                category_id: 5, 
                base_price: 18.00,    // <-- CORREGIDO
                min_stock: 40,        // <-- CORREGIDO
                perishable: false,  // <-- CORREGIDO
                status: true,
            },
        ];

        // 1. Obtener los nombres de los productos ya existentes
        const existingProducts = await ProductDB.findAll({ attributes: ['name'] }); 
        const existingNames = existingProducts.map(product => (product as any).name);

        // 2. Filtrar productos que no existan
        const uniqueProductsToCreate = productsToCreate.filter(product => 
            !existingNames.includes(product.name)
        );

        // 3. Aplicar fechas
        const finalProducts = uniqueProductsToCreate.map(product => ({
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        if (finalProducts.length > 0) {
            // 4. Insertar
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