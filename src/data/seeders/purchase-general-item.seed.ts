// src/data/seeders/purchaseGeneralItem.seed.ts
import { 
    PurchaseGeneralItemDB, 
    PurchaseDB, 
    ProductDB,
    DepotDB 
} from "src/models";

export const purchaseGeneralItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Compra (General)...");

        // --- 1. Definir los detalles a crear (PRODUCTOS ACTUALIZADOS) ---
        const detailsToCreate = [
            // Compra 1 (Era tecnología, ahora Muebles)
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Mesa Plegable Tipo Maletín (1.80m)", // Reemplaza Laptop
                depotName: "Almacén Principal",
                amount: 5,
                unit_cost: 190.00
            },
            {
                purchaseKey: `1-${new Date("2025-10-14T10:00:00").toISOString()}`,
                productName: "Estante Plástico 4 Niveles", // Reemplaza Monitor
                depotName: "Almacén Principal",
                amount: 10,
                unit_cost: 45.00
            },
            
            // Compra 2 (Herramientas y Varios)
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Martillo de Uña Curva 16oz (Mango Madera)", // Correcto
                depotName: "Almacén Principal",
                amount: 20,
                unit_cost: 42.00
            },
            {
                purchaseKey: `2-${new Date("2025-10-18T15:30:00").toISOString()}`,
                productName: "Tirro Plástico Transparente (Cinta de Embalaje)", // Reemplaza Resma Papel
                depotName: "Taller y Stock de Repuestos", // Intentará buscar este, si no usa el default
                amount: 50,
                unit_cost: 2.20
            },

            // Compra 3 (Mobiliario y Seguridad/Insumos)
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Silla Plástica Manaplas (Sin brazos)", // Reemplaza Silla Ejecutiva
                depotName: "Almacén Principal",
                amount: 8,
                unit_cost: 20.00
            },
            {
                purchaseKey: `3-${new Date("2025-10-16T11:00:00").toISOString()}`,
                productName: "Teipe Cobra Negro (Cinta Eléctrica) 18m", // Reemplaza Guantes
                depotName: "Almacén Principal",
                amount: 30,
                unit_cost: 4.00
            },

            // Compra 4 (Herramientas e Insumos)
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Destornillador Estriado Pretul 1/4\" x 4\"", // Reemplaza Destornillador
                depotName: "Almacén Principal",
                amount: 40,
                unit_cost: 9.50
            },
            {
                purchaseKey: `4-${new Date("2025-10-19T09:45:00").toISOString()}`,
                productName: "Pintura En Spray / Aerosol Colores Estándar 400ml Zasc", // Reemplaza Toner
                depotName: "Almacén Principal",
                amount: 15,
                unit_cost: 5.00
            },
        ];

        // --- 2. Obtener IDs de la DB ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));

        const purchases = await PurchaseDB.findAll({ attributes: ['purchase_id', 'provider_id', 'bought_at'] });
        const purchaseMap = new Map(purchases.map(p => {
            // Nota: Asegúrate de que las fechas en la DB coincidan exactamente con las generadas aquí
            const key = `${(p as any).provider_id}-${(p as any).bought_at.toISOString()}`;
            return [key, (p as any).purchase_id];
        }));

        // 2b. Obtener Depots y definir fallback
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));
        // Fallback: Si no encuentra el almacén específico, usa el primero disponible
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : null;

        if (!defaultDepotId) {
            throw new Error("No hay almacenes (Depots) creados en la base de datos. Ejecuta el seed de Depots primero.");
        }

        // 3. Obtener detalles existentes
        const existingDetails = await PurchaseGeneralItemDB.findAll({ attributes: ['purchase_id', 'product_id', 'depot_id'] });
        const existingTriplets = new Set(existingDetails.map(d => 
            `${(d as any).purchase_id}-${(d as any).product_id}-${(d as any).depot_id}`
        ));

        // --- 4. Mapear y filtrar ---
        const finalDetailsToCreate = [];
        for (const detail of detailsToCreate) {
            const product_id = productMap.get(detail.productName);
            const purchase_id = purchaseMap.get(detail.purchaseKey);
            
            // Lógica de Almacén segura: Busca el nombre, si no existe, usa el default
            let depot_id = depotMap.get(detail.depotName);
            if (!depot_id) {
                console.warn(`Almacén '${detail.depotName}' no encontrado. Usando almacén por defecto (ID: ${defaultDepotId}).`);
                depot_id = defaultDepotId;
            }

            if (!product_id) {
                console.warn(`Producto no encontrado: ${detail.productName}. Saltando...`);
                continue;
            }
            if (!purchase_id) {
                console.warn(`Compra no encontrada para key: ${detail.purchaseKey}. (Verifica que corriste el seed de Purchases). Saltando...`);
                continue;
            }

            const tripletKey = `${purchase_id}-${product_id}-${depot_id}`;
            if (existingTriplets.has(tripletKey)) {
                console.log(`Detalle para ${detail.productName} en compra ${purchase_id} ya existe. Saltando...`);
                continue;
            }

            finalDetailsToCreate.push({
                purchase_id,
                product_id,
                depot_id, 
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