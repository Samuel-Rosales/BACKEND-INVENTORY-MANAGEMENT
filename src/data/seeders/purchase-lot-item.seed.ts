import { 
    PurchaseLotItemDB, 
    PurchaseDB, 
    ProductDB,
    DepotDB // <-- 1. IMPORTAR DEPOTDB
} from "src/models";

export const purchaseLotItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (Lotes)...");

        // --- 1. Definir los detalles a crear (AJUSTADO) ---
        const lotDetailsToCreate = [
            {
                purchaseKey: `1-${new Date("2025-10-21T08:00:00").toISOString()}`,
                productName: "Baterías AAA (Paquete 4)",
                depotName: "Almacén Central Norte", // <-- AÑADIDO
                amount: 100,
                unit_cost: 3.20,
                expiration_date: "2027-10-01",
            },
            {
                purchaseKey: `1-${new Date("2025-10-21T08:00:00").toISOString()}`,
                productName: "Baterías AAA (Paquete 4)",
                depotName: "Mini-Hub de Distribución Este", // <-- AÑADIDO (Ejemplo de división)
                amount: 50,
                unit_cost: 3.30,
                expiration_date: "2028-04-01",
            },
        ];

        // --- 2. Obtener IDs de la DB (AJUSTADO) ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));

        const purchases = await PurchaseDB.findAll({ attributes: ['purchase_id', 'provider_id', 'bought_at'] });
        const purchaseMap = new Map(purchases.map(p => {
            const key = `${(p as any).provider_id}-${(p as any).bought_at.toISOString()}`;
            return [key, (p as any).purchase_id];
        }));
        
        // 2b. Obtener Depots
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));


        // 3. Obtener detalles existentes (AJUSTADO)
        const existingLots = await PurchaseLotItemDB.findAll({ 
            attributes: ['purchase_id', 'product_id', 'expiration_date', 'depot_id'] 
        });
        const existingLotSet = new Set(existingLots.map(l => 
            `${(l as any).purchase_id}-${(l as any).product_id}-${new Date((l as any).expiration_date).toISOString()}-${(l as any).depot_id}`
        ));

        // --- 4. Mapear y filtrar (AJUSTADO) ---
        const finalLotDetailsToCreate = [];
        for (const detail of lotDetailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);
            const depot_id = depotMap.get(detail.depotName); // <-- OBTENER ID DE DEPOT
            const expiration_date = new Date(detail.expiration_date);

            if (!product_id || !purchase_id || !depot_id) {
                console.warn(`ID no encontrado para ${detail.productName}, ${detail.purchaseKey} o ${detail.depotName}. Saltando...`);
                continue;
            }

            const lotKey = `${purchase_id}-${product_id}-${expiration_date.toISOString()}-${depot_id}`;
            if (existingLotSet.has(lotKey)) {
                console.log(`Detalle de lote para ${detail.productName} con vcto ${detail.expiration_date} en almacén ${depot_id} ya existe. Saltando...`);
                continue;
            }

            // --- INICIO DE DONDE SE CORTÓ ---
            finalLotDetailsToCreate.push({
                purchase_id,
                product_id,
                depot_id: depot_id, // <-- AÑADIDO
                amount: detail.amount,
                unit_cost: detail.unit_cost,
                expiration_date: expiration_date, // <-- LÍNEA COMPLETADA
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // --- FIN DE DONDE SE CORTÓ ---
        }

        // --- 5. Insertar ---
        if (finalLotDetailsToCreate.length > 0) {
            const createdLots = await PurchaseLotItemDB.bulkCreate(finalLotDetailsToCreate);
            console.log(`Seed de Detalles de Compra (Lotes) ejecutado. Insertados: ${createdLots.length}`);
       } else {
            console.log("Seed de Detalles de Compra (Lotes) ejecutado. No se insertaron nuevos detalles.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Detalles de Compra (Lotes):", error);
        throw error;
    }
};