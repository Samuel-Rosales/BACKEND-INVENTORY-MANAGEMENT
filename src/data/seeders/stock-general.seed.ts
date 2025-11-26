// src/data/seeders/stockGeneral.seed.ts
import { StockGeneralDB, ProductDB, DepotDB } from "src/models";

export const stockGeneralSeed = async () => {
    try {
        console.log("Iniciando seed de Stock General (No Perecederos)...");

        // HE ACTUALIZADO ESTA LISTA con los productos nuevos que son NO PERECEDEROS
        const stockToCreate = [
            // --- Higiene y Limpieza (No perecederos) ---
            { productName: "Jabón de Tocador Protex Avena (110g)", depotName: "Almacén Principal", amount: 50 },
            { productName: "Papel Higiénico Rosal Plus (4 Rollos)", depotName: "Almacén Principal", amount: 100 },
            { productName: "Champú Head & Shoulders Limpieza Renovadora (375ml)", depotName: "Almacén Principal", amount: 30 },
            { productName: "Detergente en Polvo Ace (900g)", depotName: "Almacén Principal", amount: 45 },
            { productName: "Cloro Nevex Regular (1 Litro)", depotName: "Almacén Principal", amount: 60 },
            
            // --- Herramientas ---
            { productName: "Destornillador Estriado Pretul 1/4\" x 4\"", depotName: "Almacén Principal", amount: 25 },
            { productName: "Martillo de Uña Curva 16oz (Mango Madera)", depotName: "Almacén Principal", amount: 15 },
            { productName: "Cinta Métrica 5 Metros (Truper/Stanley)", depotName: "Almacén Principal", amount: 20 },
            { productName: "Alicate Universal 8 TOTAL\" (Mango de Goma)", depotName: "Almacén Principal", amount: 18 },
            
            // --- Ferretería ---
            { productName: "Bombillo LED 9W Luz Blanca (Rosca E27)", depotName: "Almacén Principal", amount: 150 },
            { productName: "Teipe Cobra Negro (Cinta Eléctrica) 18m", depotName: "Almacén Principal", amount: 80 },
            { productName: "Candado de Hierro 30mm (Cisa)", depotName: "Almacén Principal", amount: 40 },

            // --- Muebles ---
            { productName: "Silla Plástica Manaplas (Sin brazos)", depotName: "Almacén Principal", amount: 50 },
            { productName: "Estante Plástico 4 Niveles", depotName: "Almacén Principal", amount: 10 },
        ];

        // --- 1. Obtener IDs ---
        const products = await ProductDB.findAll({ 
            attributes: ['product_id', 'name', 'perishable'] 
        });
        
        // Aseguramos que existe al menos un almacén, si no buscamos el primero disponible
        let depots = await DepotDB.findAll({ 
            attributes: ['depot_id', 'name'] 
        });

        // Fallback: Si no existe "Almacén Principal", usamos el primer almacén que encontremos para evitar errores
        const defaultDepotName = depots.length > 0 ? (depots[0] as any).name : "Almacén Principal";

        // --- 2. Mapear IDs ---
        const productMap = new Map(products.map(p => [(p as any).name, (p as any).product_id])); 
        const productIsPerishable = new Map(products.map(p => [(p as any).name, (p as any).perishable])); 
        const depotMap = new Map(depots.map(d => [(d as any).name, (d as any).depot_id])); 

        // 3. Obtener el stock existente para no duplicar
        const existingStock = await StockGeneralDB.findAll({ attributes: ['product_id', 'depot_id'] });
        const existingPairs = new Set(existingStock.map(s => `${(s as any).product_id}-${(s as any).depot_id}`));

        // 4. Mapear y filtrar
        const finalStockToCreate = [];
        
        for (const item of stockToCreate) {
            // Verificación de seguridad por si cambiaste el nombre del almacén en la BD
            const targetDepotName = depotMap.has(item.depotName) ? item.depotName : defaultDepotName;

            // Filtro: Solo NO perecederos
            if (productIsPerishable.get(item.productName) === true) {
                console.warn(`Producto '${item.productName}' es perecedero. No se debe añadir a StockGeneral. Saltando...`);
                continue;
            }

            const product_id = productMap.get(item.productName);
            const depot_id = depotMap.get(targetDepotName);

            if (!product_id) {
                console.warn(`Producto no encontrado en BD: ${item.productName}. Saltando...`);
                continue;
            }
            if (!depot_id) {
                 console.warn(`Almacén no encontrado: ${targetDepotName}. Saltando...`);
                 continue;
            }

            const pairKey = `${product_id}-${depot_id}`;
            if (existingPairs.has(pairKey)) {
                // Opcional: Podrías hacer un update aquí si quisieras actualizar la cantidad
                console.log(`Stock para ${item.productName} ya existe. Saltando...`);
                continue;
            }

            finalStockToCreate.push({
                product_id,
                depot_id,
                amount: item.amount,
                status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 5. Insertar
        if (finalStockToCreate.length > 0) {
            const createdStock = await StockGeneralDB.bulkCreate(finalStockToCreate);
            console.log(`Seed de Stock General ejecutado. Insertados: ${createdStock.length}`);
        } else {
            console.log("Seed de Stock General ejecutado. No se insertaron nuevos registros.");
        }

    } catch (error) {
        console.error("Error al ejecutar seed de Stock General:", error);
        throw error;
    }
};