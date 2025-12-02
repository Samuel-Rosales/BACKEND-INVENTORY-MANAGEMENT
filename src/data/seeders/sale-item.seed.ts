// src/data/seeders/saleItem.seed.ts
import { SaleItemDB, ProductDB, DepotDB, SaleDB } from "src/models"; 

export const saleItemSeed = async () => {
    try {
        console.log("Iniciando seed de Detalles de Venta (COMPLETO)...");

        // 1. OBTENER DATOS REALES DE LA BD
        // Necesitamos saber qué ventas existen para asignarles items
        const sales = await SaleDB.findAll({ attributes: ['sale_id'] });
        const saleIds = sales.map((s: any) => s.sale_id);

        if (saleIds.length === 0) {
            throw new Error("No hay ventas (Sales) creadas. Ejecuta el seed de Ventas primero.");
        }

        const products = await ProductDB.findAll({ attributes: ['product_id', 'name'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id', 'name'] });
        
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : null;
        if (!defaultDepotId) throw new Error("No hay almacenes creados.");

        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id]));
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id]));

        // --- 2. LISTA DE ITEMS MANUALES (Para las primeras 5 ventas fijas) ---
        // 'unit_cost' aquí representa el PRECIO DE VENTA al cliente.
        const manualItems = [
            // Venta 1
            { 
                sale_id: 1, 
                productName: "Mesa Plegable Tipo Maletín (1.80m)", 
                depotName: "Almacén Principal", 
                unit_cost: 210.00, // Venta
                amount: 1 
            },
            { 
                sale_id: 1, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                unit_cost: 25.00, 
                amount: 4 
            },
            // Venta 2
            { 
                sale_id: 2, 
                productName: "Silla Plástica Manaplas (Sin brazos)", 
                depotName: "Almacén Principal", 
                unit_cost: 25.00, 
                amount: 2 
            },
            // Venta 3
            { 
                sale_id: 3, 
                productName: "Martillo de Uña Curva 16oz (Mango Madera)", 
                depotName: "Almacén Principal", 
                unit_cost: 50.00, 
                amount: 1 
            },
            { 
                sale_id: 3, 
                productName: "Destornillador Estriado Pretul 1/4\" x 4\"", 
                depotName: "Almacén Principal", 
                unit_cost: 12.00, 
                amount: 1 
            },
            // Venta 4
            { 
                sale_id: 4, 
                productName: "Tirro Plástico Transparente (Cinta de Embalaje)", 
                depotName: "Almacén Principal", 
                unit_cost: 3.50, 
                amount: 5 
            },
            // Venta 5
            { 
                sale_id: 5, 
                productName: "Estante Plástico 4 Niveles", 
                depotName: "Almacén Principal", 
                unit_cost: 60.00, 
                amount: 2 
            },
        ];

        // --- 3. GENERADOR DE ITEMS ALEATORIOS (Para las ventas 6 en adelante) ---
        // Lista de productos con precios de venta simulados
        const catalog = [
            { name: "Harina de Maíz Blanco P.A.N. (1kg)", price: 1.50 },
            { name: "Arroz Blanco de Mesa Primor (1kg)", price: 2.20 },
            { name: "Margarina Mavesa (500g)", price: 3.50 },
            { name: "Aceite de Maíz Mazeite (1L)", price: 5.00 },
            { name: "Jabón de Tocador Protex Avena (110g)", price: 2.00 },
            { name: "Champú Head & Shoulders Limpieza Renovadora (375ml)", price: 12.00 },
            { name: "Papel Higiénico Rosal Plus (4 Rollos)", price: 5.00 },
            { name: "Cloro Nevex Regular (1 Litro)", price: 3.50 },
            { name: "Bombillo LED 9W Luz Blanca (Rosca E27)", price: 4.00 },
            { name: "Teipe Cobra Negro (Cinta Eléctrica) 18m", price: 6.00 }
        ];

        const randomItems = [];
        
        // Generamos unos 150 items distribuidos entre todas las ventas existentes
        for (let i = 0; i < 150; i++) {
            // Seleccionar una venta aleatoria de las que EXISTEN en la BD
            const randomSaleId = saleIds[Math.floor(Math.random() * saleIds.length)];
            
            // Seleccionar producto aleatorio
            const prod = catalog[Math.floor(Math.random() * catalog.length)];
            
            // Cantidad aleatoria (1-10)
            const qty = Math.floor(Math.random() * 10) + 1;

            randomItems.push({
                sale_id: randomSaleId,
                productName: prod.name,
                depotName: "Almacén Principal",
                unit_cost: prod.price, // Precio de Venta
                amount: qty
            });
        }

        // Unimos todo
        const allItemsToCreate = [...manualItems, ...randomItems];

        // --- 4. VALIDACIÓN Y CREACIÓN ---
        const existingItems = await SaleItemDB.findAll({ attributes: ['sale_id', 'product_id'] });
        const existingSet = new Set(existingItems.map(i => `${(i as any).sale_id}-${(i as any).product_id}`));

        const finalItems = [];
        
        for (const item of allItemsToCreate) {
            const product_id = productMap.get(item.productName);
            let depot_id = depotMap.get(item.depotName);
            if (!depot_id) depot_id = defaultDepotId;

            // Validaciones
            if (!product_id) continue; // Si el producto no existe, saltar
            if (existingSet.has(`${item.sale_id}-${product_id}`)) continue; // Si ya existe el item en esa venta, saltar

            // Agregamos al set temporal para evitar duplicados dentro del mismo loop
            existingSet.add(`${item.sale_id}-${product_id}`);

            finalItems.push({
                sale_id: item.sale_id,
                product_id,
                depot_id, 
                unit_cost: item.unit_cost, // Precio Venta
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        if (finalItems.length > 0) {
            await SaleItemDB.bulkCreate(finalItems);
            console.log(`Seed de Items de Venta ejecutado. Insertados: ${finalItems.length} detalles.`);
        } else {
            console.log("No se insertaron nuevos items (ya existían o no se encontraron productos).");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Items de Venta:", error);
        throw error;
    }
};