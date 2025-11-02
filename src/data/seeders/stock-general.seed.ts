// src/seeds/stockGeneral.seed.ts
import { StockGeneralDB, ProductDB, DepotDB } from "src/models";

export const stockGeneralSeed = async () => {
    try {
        console.log("Iniciando seed de Stock General (No Perecederos)...");

        // Definimos el stock usando los nombres para buscar los IDs
        const stockToCreate = [
            { productName: "Laptop HP ProBook", depotName: "Almacén Central Norte", amount: 12 },
            { productName: "Monitor LED 24 pulgadas", depotName: "Almacén Central Norte", amount: 25 },
            { productName: "Martillo de Uña 20oz", depotName: "Depósito Regional Sur", amount: 55 },
            { productName: "Destornillador Phillips N°2", depotName: "Depósito Regional Sur", amount: 75 },
            { productName: "Silla Ergonómica Ejecutiva", depotName: "Almacén Central Norte", amount: 10 },
            { productName: "Silla Ergonómica Ejecutiva", depotName: "Mini-Hub de Distribución Este", amount: 8 },
            { productName: "Archivador de Metal 3 Gavetas", depotName: "Almacén Central Norte", amount: 10 },
            { productName: "Resma de Papel Carta", depotName: "Taller y Stock de Repuestos", amount: 120 },
            { productName: "Toner Negro LaserJet", depotName: "Taller y Stock de Repuestos", amount: 30 },
            { productName: "Guantes de Seguridad Nitrilo", depotName: "Depósito Regional Sur", amount: 80 },
        ];

        // 1. Obtener IDs de Productos y Almacenes
        const products = await ProductDB.findAll({ attributes: ['id', 'name', 'es_perecedero'] });
        const depots = await DepotDB.findAll({ attributes: ['id', 'name'] });

        const productMap = new Map(products.map(p => [(p as any).name, (p as any).id]));
        const productIsPerishable = new Map(products.map(p => [(p as any).name, (p as any).es_perecedero]));
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).id]));

        // 2. Obtener el stock existente (llave compuesta)
        const existingStock = await StockGeneralDB.findAll({ attributes: ['product_id', 'depot_id'] });
        const existingPairs = new Set(existingStock.map(s => `${(s as any).product_id}-${(s as any).depot_id}`));

        // 3. Mapear y filtrar
        const finalStockToCreate = [];
        for (const item of stockToCreate) {
            // Validar que el producto sea NO perecedero
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

            // Validar que la dupla (product_id, depot_id) no exista
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

        // 4. Insertar
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