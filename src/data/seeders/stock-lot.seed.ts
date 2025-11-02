import { StockLotDB, ProductDB, DepotDB } from "src/models";

export const stockLotSeed = async () => {
    try {
        console.log("Iniciando seed de Stock por Lotes (Perecederos)...");

        const lotsToCreate = [
            {
                productName: "Baterías AAA (Paquete 4)",
                depotName: "Almacén Central Norte",
                expiration_date: "2027-10-01",
                amount: 150,
                cost_lot: 2.80,
                status: true,
            },
            {
                productName: "Baterías AAA (Paquete 4)",
                depotName: "Almacén Central Norte",
                expiration_date: "2028-03-01",
                amount: 100,
                cost_lot: 2.90,
                status: true,
            },
            {
                productName: "Baterías AAA (Paquete 4)",
                depotName: "Mini-Hub de Distribución Este",
                expiration_date: "2027-10-01",
                amount: 80,
                cost_lot: 2.80,
                status: true,
            },
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
        
        // 3. Mapear y filtrar
        const finalLotsToCreate = [];
        for (const item of lotsToCreate) {
            if (productIsPerishable.get(item.productName) === false) {
                console.warn(`Producto '${item.productName}' NO es perecedero. No se debe añadir a StockLot. Saltando...`);
                continue;
            }

            const product_id = productMap.get(item.productName);
            const depot_id = depotMap.get(item.depotName);

            if (!product_id || !depot_id) {
                console.warn(`Nombre de Producto o Almacén no encontrado para ${item.productName}/${item.depotName}. Saltando...`);
                continue;
            }

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