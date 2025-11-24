import { StockGeneralDB, ProductDB, DepotDB } from "src/models";

export const stockGeneralSeed = async () => {
    try {
        console.log("Iniciando seed de Stock General (No Perecederos)...");

        const stockToCreate = [
            { productName: "Laptop HP ProBook", depotName: "Almacén Principal", amount: 12 },
            { productName: "Monitor LED 24 pulgadas", depotName: "Almacén Principal", amount: 25 },
            { productName: "Martillo de Uña 20oz", depotName: "Almacén Principal", amount: 55 },
            { productName: "Destornillador Phillips N°2", depotName: "Almacén Principal", amount: 75 },
            { productName: "Silla Ergonómica Ejecutiva", depotName: "Almacén Principal", amount: 10 },
            { productName: "Archivador de Metal 3 Gavetas", depotName: "Almacén Principal", amount: 10 },
            { productName: "Resma de Papel Carta", depotName: "Almacén Principal", amount: 120 },
            { productName: "Toner Negro LaserJet", depotName: "Almacén Principal", amount: 30 },
            { productName: "Guantes de Seguridad Nitrilo", depotName: "Almacén Principal", amount: 80 },
        ];

        // --- 1. Obtener IDs (CORREGIDO) ---
        const products = await ProductDB.findAll({ 
            attributes: ['product_id', 'name', 'perishable'] // <--- CAMBIO AQUÍ
        });
        const depots = await DepotDB.findAll({ 
            attributes: ['depot_id', 'name'] // <--- CAMBIO AQUÍ
        });

        // --- 2. Mapear IDs (CORREGIDO) ---
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id])); // <--- CAMBIO AQUÍ
        const productIsPerishable = new Map(products.map(p => [(p as any).name, (p as any).perishable])); // <--- CAMBIO AQUÍ
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id])); // <--- CAMBIO AQUÍ

        // 3. Obtener el stock existente
        const existingStock = await StockGeneralDB.findAll({ attributes: ['product_id', 'depot_id'] });
        const existingPairs = new Set(existingStock.map(s => `${(s as any).product_id}-${(s as any).depot_id}`));

        // 4. Mapear y filtrar
        const finalStockToCreate = [];
        for (const item of stockToCreate) {
            if (productIsPerishable.get(item.productName) === true) {
                console.warn(`Producto '${item.productName}' es perecedero. No se debe añadir a StockGeneral. Saltando...`);
                continue;
            }

            const product_id = productMap.get(item.productName);
            const depot_id = depotMap.get(item.depotName);

            if (!product_id || !depot_id) {
                console.warn(`Nombre de Producto o Almacén no encontrado para ${item.productName}/${item.depotName}. Saltando...`);
                continue;
            }

            const pairKey = `${product_id}-${depot_id}`;
            if (existingPairs.has(pairKey)) {
                console.log(`Stock para ${item.productName} en ${item.depotName} ya existe. Saltando...`);
                continue;
            }

            finalStockToCreate.push({
                product_id,
                depot_id,
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 5. Insertar
        if (finalStockToCreate.length > 0) {
            const createdStock = await StockGeneralDB.bulkCreate(finalStockToCreate);
            console.log(`Seed de Stock General ejecutado. Insertados: ${createdStock.length}`);
        } else {
            console.log("Seed de Stock General ejecutado. No se insertaron nuevos registros.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Stock General:", error);
        throw error;
    }
};