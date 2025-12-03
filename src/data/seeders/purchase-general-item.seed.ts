import { PurchaseGeneralItemDB, PurchaseDB, ProductDB, DepotDB } from "src/models";
import { db as sequelize } from "../../config";

export const purchaseGeneralItemSeed = async () => {
    try {
        console.log("🧼 Abasteciendo Limpieza e Higiene...");

        const purchases = await PurchaseDB.findAll({ attributes: ['purchase_id'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id'] });
        // Filtramos NO perecederos (Jabón, Cloro, Papel)
        const products = await ProductDB.findAll({ 
            where: { perishable: false },
            attributes: ['product_id', 'name', 'base_price'] 
        });

        const purchaseIds = purchases.map((p: any) => p.purchase_id);
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : 1;
        const itemsToCreate = [];

        // Solo algunas compras incluyen artículos de limpieza (no todas)
        for (const purchaseId of purchaseIds) {
            if (Math.random() > 0.6) continue; // 40% chance de tener limpieza

            const itemsCount = Math.floor(Math.random() * 3) + 1;

            for (let k = 0; k < itemsCount; k++) {
                const prod = products[Math.floor(Math.random() * products.length)];
                
                // Cantidades de reposición (Docenas)
                const amount = Math.floor(Math.random() * 24) + 12;

                itemsToCreate.push({
                    purchase_id: purchaseId,
                    product_id: (prod as any).product_id,
                    depot_id: defaultDepotId,
                    amount: amount,
                    unit_cost: parseFloat((prod as any).base_price),
                    status: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        if (itemsToCreate.length > 0) {
            await PurchaseGeneralItemDB.bulkCreate(itemsToCreate);
            console.log(`✅ Stock de Limpieza cargado.`);
        }

        // --- SINCRONIZACIÓN DE TOTALES (IMPORTANTE) ---
        console.log("🔄 Sincronizando totales de COMPRAS...");
        const purchTable = PurchaseDB.getTableName();
        
        // Esta query asume que ya insertaste los Lotes (Perecederos) antes
        const query = `
            UPDATE ${purchTable}
            SET 
                total_usd = (
                    SELECT COALESCE(SUM(amount * unit_cost), 0) FROM purchase_lot_items WHERE purchase_id = ${purchTable}.purchase_id
                ) + (
                    SELECT COALESCE(SUM(amount * unit_cost), 0) FROM purchase_general_items WHERE purchase_id = ${purchTable}.purchase_id
                ),
                total_ves = (
                     (SELECT COALESCE(SUM(amount * unit_cost), 0) FROM purchase_lot_items WHERE purchase_id = ${purchTable}.purchase_id) 
                     + 
                     (SELECT COALESCE(SUM(amount * unit_cost), 0) FROM purchase_general_items WHERE purchase_id = ${purchTable}.purchase_id)
                ) * exchange_rate
            WHERE active = true;
        `;
        await sequelize.query(query);
        console.log("✅ Totales de Compras actualizados.");

    } catch (error) {
        console.error("❌ Error seed General Items:", error);
        throw error;
    }
};