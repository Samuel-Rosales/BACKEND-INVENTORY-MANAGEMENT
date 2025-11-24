import { 
    PurchaseGeneralItemDB, 
    PurchaseDB, 
    ProductDB,
    DepotDB // <-- 1. IMPORTAR DEPOTDB
} from "src/models";

export const purchaseGeneralItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (General)...");

        // --- 1. Definir los detalles a crear (AJUSTADO) ---
        const detailsToCreate = [
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Laptop HP ProBook",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 5,
                unit_cost: 840.00
            },
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Monitor LED 24 pulgadas",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 10,
                unit_cost: 185.00
            },
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Martillo de Uña 20oz",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 20,
                unit_cost: 14.50
            },
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Resma de Papel Carta",
                depotName: "Taller y Stock de Repuestos", // <-- AÑADIDO
                amount: 50,
                unit_cost: 5.00
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Silla Ergonómica Ejecutiva",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 8,
                unit_cost: 145.00
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Guantes de Seguridad Nitrilo",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 30,
                unit_cost: 17.50
            },
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Destornillador Phillips N°2",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 40,
                unit_cost: 12.00
            },
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Toner Negro LaserJet",
                depotName: "Almacén Principal", // <-- AÑADIDO
                amount: 15,
                unit_cost: 44.00
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

        // 3. Obtener detalles existentes (AJUSTADO para incluir depot_id)
        const existingDetails = await PurchaseGeneralItemDB.findAll({ attributes: ['purchase_id', 'product_id', 'depot_id'] });
        const existingTriplets = new Set(existingDetails.map(d => 
            `${(d as any).purchase_id}-${(d as any).product_id}-${(d as any).depot_id}`
        ));

        // --- 4. Mapear y filtrar (AJUSTADO) ---
        const finalDetailsToCreate = [];
        for (const detail of detailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);
            const depot_id = depotMap.get(detail.depotName); // <-- OBTENER ID DE DEPOT

            if (!product_id || !purchase_id || !depot_id) {
                console.warn(`ID no encontrado para ${detail.productName}, ${detail.purchaseKey} o ${detail.depotName}. Saltando...`);
                continue;
            }

            const tripletKey = `${purchase_id}-${product_id}-${depot_id}`;
            if (existingTriplets.has(tripletKey)) {
                console.log(`Detalle para ${detail.productName} en compra ${purchase_id} y almacén ${depot_id} ya existe. Saltando...`);
                continue;
            }

            finalDetailsToCreate.push({
                purchase_id,
                product_id,
                depot_id: depot_id, // <-- AÑADIDO
                amount: detail.amount,
                unit_cost: detail.unit_cost,
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