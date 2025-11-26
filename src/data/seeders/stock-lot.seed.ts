// src/data/seeders/stockLot.seed.ts
import { StockLotDB, ProductDB, DepotDB } from "src/models";

export const stockLotSeed = async () => {
    try {
        console.log("Iniciando seed de Stock por Lotes (Perecederos)...");

        // LISTA ACTUALIZADA CON TUS PRODUCTOS PERECEDEROS REALES
        const lotsToCreate = [
            // --- Alimentos (Tienen vencimiento) ---
            {
                productName: "Harina de Maíz Blanco P.A.N. (1kg)",
                depotName: "Almacén Principal",
                expiration_date: "2026-06-15", // Vence en ~6 meses
                amount: 100,
                cost_lot: 1.10, // Costo un poco menor al precio de venta
                status: true,
            },
            {
                productName: "Harina de Maíz Blanco P.A.N. (1kg)", // Segundo lote del mismo producto
                depotName: "Almacén Principal",
                expiration_date: "2026-09-20", // Fecha diferente
                amount: 50,
                cost_lot: 1.15, 
                status: true,
            },
            {
                productName: "Arroz Blanco de Mesa Primor (1kg)",
                depotName: "Almacén Principal",
                expiration_date: "2027-01-10",
                amount: 120,
                cost_lot: 1.65,
                status: true,
            },
            {
                productName: "Margarina Mavesa (500g)",
                depotName: "Almacén Principal",
                expiration_date: "2026-03-01", // Vence pronto
                amount: 40,
                cost_lot: 2.50,
                status: true,
            },
            {
                productName: "Pasta Spaghetti Mary (1kg)",
                depotName: "Almacén Principal",
                expiration_date: "2028-05-15", // Larga duración
                amount: 80,
                cost_lot: 1.90,
                status: true,
            },

            // --- Higiene (Algunos tienen vencimiento) ---
            {
                productName: "Crema Dental Colgate Triple Acción (100ml)",
                depotName: "Almacén Principal",
                expiration_date: "2027-11-30",
                amount: 60,
                cost_lot: 2.80,
                status: true,
            },
            {
                productName: "Desodorante Rexona Bamboo (Barra 50g)",
                depotName: "Almacén Principal",
                expiration_date: "2027-08-20",
                amount: 35,
                cost_lot: 4.50,
                status: true,
            }
        ];

        // --- 1. Obtener IDs ---
        const products = await ProductDB.findAll({ 
            attributes: ['product_id', 'name', 'perishable'] 
        });
        
        // Obtener almacenes y definir fallback
        const depots = await DepotDB.findAll({ 
            attributes: ['depot_id', 'name'] 
        });
        const defaultDepotName = depots.length > 0 ? (depots[0] as any).name : "Almacén Principal";

        // --- 2. Mapear IDs ---
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id])); 
        const productIsPerishable = new Map(products.map(p => [(p as any).name, (p as any).perishable])); 
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id])); 
        
        // 3. Mapear y filtrar
        const finalLotsToCreate = [];
        
        for (const item of lotsToCreate) {
            const targetDepotName = depotMap.has(item.depotName) ? item.depotName : defaultDepotName;

            // Filtro: Solo PERECEDEROS (Note: logic is distinct from stockGeneral)
            if (productIsPerishable.get(item.productName) === false) {
                console.warn(`Producto '${item.productName}' NO es perecedero. No se debe añadir a StockLot. Saltando...`);
                continue;
            }

            const product_id = productMap.get(item.productName);
            const depot_id = depotMap.get(targetDepotName);

            if (!product_id) {
                console.warn(`Producto no encontrado en BD: ${item.productName}. Saltando...`);
                continue;
            }
            if (!depot_id) {
                console.warn(`Almacén no encontrado: ${targetDepotName}. Saltando...`);
                continue;
            }

            // Nota: En StockLot SÍ permitimos duplicados (mismo producto, diferente lote/fecha), 
            // así que no comprobamos 'existingPairs' como en StockGeneral.

            finalLotsToCreate.push({
                product_id,
                depot_id,
                expiration_date: new Date(item.expiration_date),
                amount: item.amount,
                cost_lot: item.cost_lot,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 4. Insertar
        if (finalLotsToCreate.length > 0) {
            const createdLots = await StockLotDB.bulkCreate(finalLotsToCreate);
            console.log(`Seed de Stock por Lotes ejecutado. Insertados: ${createdLots.length}`);
        } else {
            console.log("Seed de Stock por Lotes ejecutado. No se insertaron nuevos lotes.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Stock por Lotes:", error);
        throw error;
    }
};