// src/data/seeders/saleItem.seed.ts
import { SaleItemDB, ProductDB, DepotDB } from "src/models"; 

export const saleItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta (CORREGIDO PARA MARGEN POSITIVO)...");

        // --- 1. Definir items a vender CON COSTOS REALES DE ADQUISICIÓN ---
        const itemsToSell = [
            // Venta 1 (Muebles y Hogar)
            { 
                sale_id: 1, 
                productName: "Mesa Plegable Tipo Maletín (1.80m)", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real (ver purchaseGeneralItem.seed) = 190.00
                // Precio Base Producto = 200.00 -> Ganancia = 10.00
                unit_cost: 190.00, 
                amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 20.00
                // Precio Base Producto = 21.50 -> Ganancia = 1.50
                unit_cost: 20.00, 
                amount: 4 
            },
            
            // Venta 2 (Sillas)
            { 
                sale_id: 2, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                // Costo de compra = 20.00
                unit_cost: 20.00, 
                amount: 2 
            },

            // Venta 3 (Herramientas y Ferretería)
            { 
                sale_id: 3, 
                productName: "Martillo de Uña Curva 16oz (Mango Madera)", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 42.00
                // Precio Base Producto = 46.00 -> Ganancia = 4.00
                unit_cost: 42.00, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Destornillador Estriado Pretul 1/4\" x 4\"", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 9.50
                // Precio Base Producto = 10.25 -> Ganancia = 0.75
                unit_cost: 9.50, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Teipe Cobra Negro (Cinta Eléctrica) 18m",
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 4.00
                // Precio Base Producto = 4.75 -> Ganancia = 0.75
                unit_cost: 4.00, 
                amount: 3 
            },

            // Venta 4 (Insumos)
            { 
                sale_id: 4, 
                productName: "Tirro Plástico Transparente (Cinta de Embalaje)", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 2.20
                // Precio Base Producto = 2.75 -> Ganancia = 0.55
                unit_cost: 2.20, 
                amount: 5 
            },

            // Venta 5 (Almacenamiento)
            { 
                sale_id: 5, 
                productName: "Estante Plástico 4 Niveles", 
                depotName: "Almacén Principal", 
                // CORREGIDO: Costo de compra real = 45.00
                // Precio Base Producto = 50.00 -> Ganancia = 5.00
                unit_cost: 45.00, 
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
                unit_cost: item.unit_cost, // AHORA SÍ ES EL COSTO REAL
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