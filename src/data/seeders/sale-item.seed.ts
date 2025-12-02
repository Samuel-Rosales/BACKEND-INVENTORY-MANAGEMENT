import { SaleItemDB, ProductDB, DepotDB } from "src/models"; 

export const saleItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta (AJUSTADO A TU LÓGICA)...");

        // NOTA: Aquí 'unit_cost' representa el PRECIO DE VENTA al cliente.
        const itemsToSell = [
            // Venta 1
            { 
                sale_id: 1, 
                productName: "Mesa Plegable Tipo Maletín (1.80m)", 
                depotName: "Almacén Principal", 
                // Producto Base: 200.00 | Venta: 210.00 -> Ganancia 10
                unit_cost: 210.00, 
                amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                // Producto Base: 21.50 | Venta: 25.00 -> Ganancia 3.5
                unit_cost: 25.00, 
                amount: 4 
            },
            
            // Venta 3 (Herramientas)
            { 
                sale_id: 3, 
                productName: "Martillo de Uña Curva 16oz (Mango Madera)", 
                depotName: "Almacén Principal", 
                // Producto Base: 46.00 | Venta: 50.00 -> Ganancia 4
                unit_cost: 50.00, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Destornillador Estriado Pretul 1/4\" x 4\"", 
                depotName: "Almacén Principal", 
                // Producto Base: 10.25 | Venta: 12.00 -> Ganancia 1.75
                unit_cost: 12.00, 
                amount: 1 
            },

            // Venta 4 (Insumos)
            { 
                sale_id: 4, 
                productName: "Tirro Plástico Transparente (Cinta de Embalaje)", 
                depotName: "Almacén Principal", 
                // Producto Base: 2.75 | Venta: 3.50 -> Ganancia 0.75
                unit_cost: 3.50, 
                amount: 5 
            },
            
            // ... Puedes agregar los aleatorios aquí si quieres ...
        ];

        // --- (El resto del código de búsqueda de IDs se mantiene igual) ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });
        
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : null;
        if (!defaultDepotId) throw new Error("No hay almacenes creados.");

        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));
        const existingItems = await SaleItemDB.findAll({ attributes: ['sale_id', 'product_id'] });
        const existingSet = new Set(existingItems.map(i => `${(i as any).sale_id}-${(i as any).product_id}`));

        const finalItems = [];
        for (const item of itemsToSell) {
            const product_id = productMap.get(item.productName);
            let depot_id = depotMap.get(item.depotName);
            if (!depot_id) depot_id = defaultDepotId;

            if (!product_id) continue;
            if (existingSet.has(`${item.sale_id}-${product_id}`)) continue;

            finalItems.push({
                sale_id: item.sale_id,
                product_id,
                depot_id, 
                unit_cost: item.unit_cost, // Aquí guardamos el PRECIO DE VENTA
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        if (finalItems.length > 0) {
            await SaleItemDB.bulkCreate(finalItems);
            console.log(`Seed insertó: ${finalItems.length} detalles.`);
        }
    } catch (error) {
        console.error(error);
    }
};