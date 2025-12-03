import { PurchaseLotItemDB, PurchaseDB, ProductDB, DepotDB } from "src/models";

export const purchaseLotItemSeed = async () => {
    try {
        console.log("📦 Abasteciendo la Bodega (Perecederos: Comida, Bebidas)...");

        const purchases = await PurchaseDB.findAll({ attributes: ['purchase_id'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id'] });
        // Filtramos solo los perecederos (Harina, Refrescos, Chucherías)
        const products = await ProductDB.findAll({ 
            where: { perishable: true },
            attributes: ['product_id', 'name', 'base_price'] 
        });

        if (purchases.length === 0) return;
        const purchaseIds = purchases.map((p: any) => p.purchase_id);
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : 1;

        const itemsToCreate = [];

        for (const purchaseId of purchaseIds) {
            // Compramos entre 2 y 5 tipos de productos diferentes por factura
            const itemsCount = Math.floor(Math.random() * 4) + 2;

            for (let k = 0; k < itemsCount; k++) {
                const prod = products[Math.floor(Math.random() * products.length)];
                
                // Fecha de vencimiento (6 meses a 2 años)
                const expDate = new Date();
                expDate.setDate(expDate.getDate() + 180 + Math.floor(Math.random() * 500));

                // Cantidades de Bodega (Bultos)
                // Harinas/Arroz: 20 a 50 unidades
                // Chupetas/Dulces: 50 a 200 unidades
                let amount = 20;
                if ((prod as any).name.includes("Chupeta") || (prod as any).name.includes("Galleta")) {
                    amount = Math.floor(Math.random() * 150) + 50; 
                } else {
                    amount = Math.floor(Math.random() * 40) + 20;
                }

                // Costo de compra (Precio base)
                const cost = parseFloat((prod as any).base_price);

                // Evitar producto broma en compras masivas si sale muy caro
                if (cost > 5000) continue; 

                itemsToCreate.push({
                    purchase_id: purchaseId,
                    product_id: (prod as any).product_id,
                    depot_id: defaultDepotId,
                    amount: amount,
                    unit_cost: cost,
                    expiration_date: expDate,
                    status: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        if (itemsToCreate.length > 0) {
            await PurchaseLotItemDB.bulkCreate(itemsToCreate);
            console.log(`✅ Stock de Alimentos y Bebidas cargado.`);
        }
    } catch (error) {
        console.error("❌ Error seed Lotes:", error);
        throw error;
    }
};