// src/data/seeders/purchaseLotItem.seed.ts
import { 
    PurchaseLotItemDB, 
    PurchaseDB, 
    ProductDB,
    DepotDB 
} from "src/models";

export const purchaseLotItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (Lotes/Perecederos)...");

        // --- 1. Definir los detalles a crear (PRODUCTOS PERECEDEROS ACTUALIZADOS) ---
        // Nota: Las purchaseKey coinciden con las del archivo general para agrupar compras
        const lotDetailsToCreate = [
            // Compra 1: Alimentos Básicos
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Harina de Maíz Blanco P.A.N. (1kg)",
                depotName: "Almacén Principal",
                amount: 100,
                unit_cost: 1.10,
                expiration_date: "2026-06-15",
            },
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Margarina Mavesa (500g)",
                depotName: "Almacén Principal",
                amount: 40,
                unit_cost: 2.50,
                expiration_date: "2026-03-01",
            },

            // Compra 2: Más Alimentos (Otro lote de Harina)
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Harina de Maíz Blanco P.A.N. (1kg)", // Mismo producto, diferente lote
                depotName: "Almacén Principal",
                amount: 50,
                unit_cost: 1.15, // Costo varió ligeramente
                expiration_date: "2026-09-20", // Fecha vencimiento diferente
            },

            // Compra 3: Higiene Personal
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Crema Dental Colgate Triple Acción (100ml)",
                depotName: "Almacén Principal",
                amount: 60,
                unit_cost: 2.80,
                expiration_date: "2027-11-30",
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Desodorante Rexona Bamboo (Barra 50g)",
                depotName: "Almacén Principal",
                amount: 35,
                unit_cost: 4.50,
                expiration_date: "2027-08-20",
            },

            // Compra 4: Alimentos Larga Duración
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Pasta Spaghetti Mary (1kg)",
                depotName: "Almacén Principal",
                amount: 80,
                unit_cost: 1.90,
                expiration_date: "2028-05-15",
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
        
        // 2b. Obtener Depots y definir fallback
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : null;

        if (!defaultDepotId) {
            throw new Error("No hay almacenes (Depots) creados. Ejecuta el seed de Depots primero.");
        }

        // 3. Obtener detalles existentes
        const existingLots = await PurchaseLotItemDB.findAll({ 
            attributes: ['purchase_id', 'product_id', 'expiration_date', 'depot_id'] 
        });
        
        const existingLotSet = new Set(existingLots.map(l => 
            `${(l as any).purchase_id}-${(l as any).product_id}-${new Date((l as any).expiration_date).toISOString()}-${(l as any).depot_id}`
        ));

        // --- 4. Mapear y filtrar ---
        const finalLotDetailsToCreate = [];
        for (const detail of lotDetailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);
            const expiration_date = new Date(detail.expiration_date);
            
            // Lógica de Almacén segura
            let depot_id = depotMap.get(detail.depotName);
            if (!depot_id) {
                console.warn(`Almacén '${detail.depotName}' no encontrado. Usando ID por defecto: ${defaultDepotId}`);
                depot_id = defaultDepotId;
            }

            if (!product_id) {
                console.warn(`Producto no encontrado: ${detail.productName}. Saltando...`);
                continue;
            }
            if (!purchase_id) {
                console.warn(`Compra no encontrada para key: ${detail.purchaseKey}. Saltando...`);
                continue;
            }

            // Comprobar duplicados
            const lotKey = `${purchase_id}-${product_id}-${expiration_date.toISOString()}-${depot_id}`;
            if (existingLotSet.has(lotKey)) {
                console.log(`Lote para ${detail.productName} (vence: ${detail.expiration_date}) ya existe. Saltando...`);
                continue;
            }

            finalLotDetailsToCreate.push({
                purchase_id,
                product_id,
                depot_id, 
                amount: detail.amount,
                unit_cost: detail.unit_cost,
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