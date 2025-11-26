// src/data/seeders/saleItem.seed.ts
import { SaleItemDB, ProductDB, DepotDB } from "src/models"; 

export const saleItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta...");

        // --- 1. Definir items a vender (PRODUCTOS ACTUALIZADOS) ---
        const itemsToSell = [
            // Venta 1 (Muebles y Hogar) - Antes era Tecnología
            { 
                sale_id: 1, 
                productName: "Mesa Plegable Tipo Maletín (1.80m)", 
                depotName: "Almacén Principal", 
                unit_cost: 210.00, // Precio venta (base 200)
                amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                unit_cost: 23.00, // Precio venta (base 21.50)
                amount: 4 
            },
            
            // Venta 2 (Sillas)
            { 
                sale_id: 2, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                unit_cost: 23.00, 
                amount: 2 
            },

            // Venta 3 (Herramientas y Ferretería)
            { 
                sale_id: 3, 
                productName: "Martillo de Uña Curva 16oz (Mango Madera)", 
                depotName: "Almacén Principal", 
                unit_cost: 48.00, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Destornillador Estriado Pretul 1/4\" x 4\"", 
                depotName: "Almacén Principal", 
                unit_cost: 11.00, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Teipe Cobra Negro (Cinta Eléctrica) 18m",
                depotName: "Almacén Principal", 
                unit_cost: 5.50, 
                amount: 3 
            },

            // Venta 4 (Insumos) - Antes era Papel
            { 
                sale_id: 4, 
                productName: "Tirro Plástico Transparente (Cinta de Embalaje)", 
                depotName: "Almacén Principal", 
                unit_cost: 3.50, 
                amount: 5 
            },

            // Venta 5 (Almacenamiento) - Antes era Archivador
            { 
                sale_id: 5, 
                productName: "Estante Plástico 4 Niveles", 
                depotName: "Almacén Principal", 
                unit_cost: 55.00, 
                amount: 2 
            },
        ];

        // --- 2. Obtener IDs para mapear ---
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });

        // Fallback para almacén
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : null;
        if (!defaultDepotId) throw new Error("No hay almacenes creados.");

        // --- 3. Mapear IDs ---
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));

        // Verificar duplicados existentes
        const existingItems = await SaleItemDB.findAll({ attributes: ['sale_id', 'product_id'] });
        const existingSet = new Set(existingItems.map(i => `${(i as any).sale_id}-${(i as any).product_id}`));

        // --- 4. Mapear y filtrar ---
        const finalItems = [];
        for (const item of itemsToSell) {
            const product_id = productMap.get(item.productName);
            
            // Lógica segura de almacén
            let depot_id = depotMap.get(item.depotName);
            if (!depot_id) depot_id = defaultDepotId;

            if (!product_id) {
                console.warn(`Producto no encontrado: ${item.productName}. Saltando...`);
                continue;
            }

            // Evitar duplicados si se corre el seed varias veces
            if (existingSet.has(`${item.sale_id}-${product_id}`)) {
                console.log(`Item para venta ${item.sale_id} (Producto: ${item.productName}) ya existe. Saltando...`);
                continue;
            }

            finalItems.push({
                sale_id: item.sale_id,
                product_id,
                depot_id, 
                unit_cost: item.unit_cost,
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // --- 5. Lógica de inserción ---
        if (finalItems.length > 0) {
            const createdItems = await SaleItemDB.bulkCreate(finalItems);
            console.log(`Seed de Items de Venta ejecutado correctamente. Insertados: ${createdItems.length} detalles.`);
        } else {
            console.log("Seed de Items de Venta ejecutado. No se insertaron nuevos detalles.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Items de Venta:", error);
        throw error;
    }
};