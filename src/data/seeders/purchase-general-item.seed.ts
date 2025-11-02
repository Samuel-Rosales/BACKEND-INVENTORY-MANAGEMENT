import { 
    PurchaseGeneralItemDB, 
    PurchaseDB, 
    ProductDB 
} from "src/models";

export const purchaseGeneralItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (General)...");

        // --- 1. Definir los detalles a crear (CORREGIDO) ---
        const detailsToCreate = [
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Laptop HP ProBook",
                amount: 5,
                unit_cost: 840.00 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Monitor LED 24 pulgadas",
                amount: 10,
                unit_cost: 185.00 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Martillo de Uña 20oz",
                amount: 20,
                unit_cost: 14.50 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Resma de Papel Carta",
                amount: 50,
                unit_cost: 5.00 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Silla Ergonómica Ejecutiva",
                amount: 8,
                unit_cost: 145.00 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Guantes de Seguridad Nitrilo",
                amount: 30,
                unit_cost: 17.50 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Destornillador Phillips N°2",
                amount: 40,
                unit_cost: 12.00 // <-- CAMBIO AQUÍ
            },
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Toner Negro LaserJet",
                amount: 15,
                unit_cost: 44.00 // <-- CAMBIO AQUÍ
            },
        ];

        // --- 2. Obtener IDs de la DB ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));

        const purchases = await PurchaseDB.findAll({ attributes: ['purchase_id', 'provider_id', 'bought_at'] });
        const purchaseMap = new Map(purchases.map(p => {
            const key = `${(p as any).provider_id}-${(p as any).bought_at.toISOString()}`;
            return [key, (p as any).purchase_id];
        }));

        // 3. Obtener detalles existentes
        const existingDetails = await PurchaseGeneralItemDB.findAll({ attributes: ['purchase_id', 'product_id'] });
        const existingPairs = new Set(existingDetails.map(d => `${(d as any).purchase_id}-${(d as any).product_id}`));

        // --- 4. Mapear y filtrar (CORREGIDO) ---
        const finalDetailsToCreate = [];
        for (const detail of detailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);

            if (!product_id || !purchase_id) {
                console.warn(`No se pudo encontrar ID para ${detail.productName} o ${detail.purchaseKey}. Saltando...`);
                continue;
            }

            const pairKey = `${purchase_id}-${product_id}`;
            if (existingPairs.has(pairKey)) {
                console.log(`Detalle para ${detail.productName} en compra ${purchase_id} ya existe. Saltando...`);
                continue;
            }

            finalDetailsToCreate.push({
                purchase_id,
                product_id,
                amount: detail.amount,
                unit_cost: detail.unit_cost, // <-- CAMBIO AQUÍ
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // --- 5. Insertar ---
        if (finalDetailsToCreate.length > 0) {
            const createdDetails = await PurchaseGeneralItemDB.bulkCreate(finalDetailsToCreate);
            console.log(`Seed de Detalles de Compra (General) ejecutado. Insertados: ${createdDetails.length}`);
        } else {
            console.log("Seed de Detalles de Compra (General) ejecutado. No se insertaron nuevos detalles.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Detalles de Compra (General):", error);
        throw error;
    }
};