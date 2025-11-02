import { 
    PurchaseLotItemDB, 
    PurchaseDB, 
    ProductDB 
} from "src/models";

export const purchaseLotItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (Lotes)...");

        // --- 1. Definir los detalles a crear ---
        const lotDetailsToCreate = [
            // --- Compra 5 (provider_id: 1, bought_at: 2025-10-21T08:00:00) ---
            // Dos lotes diferentes en la misma compra
            {
                purchaseKey: `1-${new Date("2025-10-21T08:00:00").toISOString()}`,
                productName: "Baterías AAA (Paquete 4)",
                amount: 100,
                cost: 3.20,
                expiration_date: "2027-10-01",
            },
            {
                purchaseKey: `1-${new Date("2025-10-21T08:00:00").toISOString()}`,
                productName: "Baterías AAA (Paquete 4)",
                amount: 50,
                cost: 3.30,
                expiration_date: "2028-04-01",
            },
        ];

        // --- 2. Obtener IDs de la DB ---
        const products = await ProductDB.findAll({ attributes: ['id', 'name'] });
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).id]));

        const purchases = await PurchaseDB.findAll({ attributes: ['id', 'provider_id', 'bought_at'] });
        const purchaseMap = new Map(purchases.map(p => {
            const key = `${(p as any).provider_id}-${(p as any).bought_at.toISOString()}`;
            return [key, (p as any).id];
        }));

        // 3. Obtener detalles existentes para no duplicar
        const existingLots = await PurchaseLotItemDB.findAll({ 
            attributes: ['purchase_id', 'product_id', 'expiration_date'] 
        });
        const existingLotSet = new Set(existingLots.map(l => 
            `${(l as any).purchase_id}-${(l as any).product_id}-${new Date((l as any).expiration_date).toISOString()}`
        ));

        // --- 4. Mapear y filtrar ---
        const finalLotDetailsToCreate = [];
        for (const detail of lotDetailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);
            const expiration_date = new Date(detail.expiration_date);

            if (!product_id || !purchase_id) {
                console.warn(`No se pudo encontrar ID para ${detail.productName} o ${detail.purchaseKey}. Saltando...`);
                continue;
            }

            const lotKey = `${purchase_id}-${product_id}-${expiration_date.toISOString()}`;
            if (existingLotSet.has(lotKey)) {
                console.log(`Detalle de lote para ${detail.productName} con vcto ${detail.expiration_date} ya existe. Saltando...`);
                continue;
            }

            finalLotDetailsToCreate.push({
                purchase_id,
                product_id,
                amount: detail.amount,
                cost: detail.cost,
                expiration_date: expiration_date,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
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