import { SaleItemDB, ProductDB, DepotDB } from "src/models"; // <-- Importar ProductDB y DepotDB

export const saleItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta...");

        // --- 1. Obtener IDs para mapear ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });

        // --- 2. Mapear IDs ---
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));

        // --- 3. Definir items a vender (con nombres) ---
        const itemsToSell = [
            // Venta 1 (Almacén Central Norte)
            { 
                sale_id: 1, 
                productName: "Laptop HP ProBook", 
                depotName: "Almacén Principal", 
                unit_cost: 999.99, amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Monitor LED 24 pulgadas", 
                depotName: "Almacén Principal", 
                unit_cost: 219.50, amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Toner Negro LaserJet", 
                depotName: "Almacén Principal", 
                unit_cost: 49.99, 
                amount: 2 
            },
            
            // Venta 2 (Sillas de dos depósitos distintos)
            { 
                sale_id: 2, 
                productName: "Silla Ergonómica Ejecutiva", 
                depotName: "Almacén Principal", 
                unit_cost: 179.99, 
                amount: 1 
            },
            { 
                sale_id: 2, 
                productName: "Silla Ergonómica Ejecutiva", 
                depotName: "Almacén Principal", 
                unit_cost: 179.99, 
                amount: 1 
            },

            // Venta 3 (Depósito Regional Sur)
            { 
                sale_id: 3, 
                productName: "Martillo de Uña 20oz", 
                depotName: "Almacén Principal", 
                unit_cost: 18.25, amount: 3 
            },
            { 
                sale_id: 3, 
                productName: "Destornillador Phillips N°2", 
                depotName: "Almacén Principal", 
                unit_cost: 14.99, 
                amount: 2 
            },
            { 
                sale_id: 3, 
                productName: "Guantes de Seguridad Nitrilo",
                depotName: "Almacén Principal", 
                unit_cost: 19.50, 
                amount: 1 
            },

            // Venta 4 (Taller)
            { sale_id: 4, productName: "Resma de Papel Carta", depotName: "Almacén Principal", unit_cost: 5.99, amount: 10 },

            // Venta 5 (Almacén Central Norte)
            { sale_id: 5, productName: "Archivador de Metal 3 Gavetas", depotName: "Almacén Principal", unit_cost: 110.00, amount: 4 },
        ];

        // --- 4. Mapear y filtrar ---
        const finalItems = [];
        for (const item of itemsToSell) {
            const product_id = productMap.get(item.productName);
            const depot_id = depotMap.get(item.depotName);

            if (!product_id || !depot_id) {
                console.warn(`Producto o Depósito no encontrado para ${item.productName}/${item.depotName}. Saltando...`);
                continue;
            }

            finalItems.push({
                sale_id: item.sale_id,
                product_id,
                depot_id, // <-- ¡AHORA SÍ ESTÁ!
                unit_cost: item.unit_cost,
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // --- 5. Lógica de inserción ---
        const createdItems = await SaleItemDB.bulkCreate(finalItems);
        console.log(`Seed de Items de Venta ejecutado correctamente. Insertados: ${createdItems.length} detalles.`);

    } catch (error) {
        console.error("Error al ejecutar seed de Items de Venta:", error);
        throw error;
    }
};