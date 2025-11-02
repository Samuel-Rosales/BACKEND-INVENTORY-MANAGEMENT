// src/seeds/product.seed.ts
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
                precio_base: 850.50,
                stock_minimo: 5,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            {
                name: "Monitor LED 24 pulgadas",
                description: "Monitor Full HD con puerto HDMI y bajo consumo energético.",
                category_id: 1, 
                precio_base: 189.75,
                stock_minimo: 7,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            
            // Categoria 2: Herramientas
            {
                name: "Martillo de Uña 20oz",
                description: "Martillo estándar para trabajos de carpintería.",
                category_id: 2, 
                precio_base: 15.00,
                stock_minimo: 20,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            {
                name: "Destornillador Phillips N°2",
                description: "Juego de 5 destornilladores de precisión con punta magnética.",
                category_id: 2, 
                precio_base: 12.90,
                stock_minimo: 35,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },

            // Categoria 3: Mobiliario
            {
                name: "Silla Ergonómica Ejecutiva",
                description: "Silla de oficina con soporte lumbar ajustable y malla transpirable.",
                category_id: 3, 
                precio_base: 150.99,
                stock_minimo: 10,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            {
                name: "Archivador de Metal 3 Gavetas",
                description: "Archivador metálico con cerradura centralizada.",
                category_id: 3, 
                precio_base: 95.50,
                stock_minimo: 5,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },

            // Categoria 4: Consumibles
            {
                name: "Resma de Papel Carta",
                description: "Papel blanco de 75g/m2, 500 hojas.",
                category_id: 4, 
                precio_base: 5.25,
                stock_minimo: 50,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            {
                name: "Toner Negro LaserJet",
                description: "Cartucho de toner de alto rendimiento, compatible con modelo 4000 series.",
                category_id: 4, 
                precio_base: 45.00,
                stock_minimo: 15,
                es_perecedero: false, // <-- CAMBIO
                status: true,
            },
            { // <-- PRODUCTO NUEVO (PERECEDERO)
                name: "Baterías AAA (Paquete 4)",
                description: "Baterías alcalinas AAA, paquete de 4.",
                category_id: 4, 
                precio_base: 3.50,
                stock_minimo: 30,
                es_perecedero: true, // <-- ¡Importante!
                status: true,
            },

            // Categoria 5: Seguridad
            {
                name: "Guantes de Seguridad Nitrilo",
                description: "Guantes industriales de nitrilo, caja de 100 unidades.",
                category_id: 5, 
                precio_base: 18.00,
                stock_minimo: 40,
                es_perecedero: false, // <-- CAMBIO
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