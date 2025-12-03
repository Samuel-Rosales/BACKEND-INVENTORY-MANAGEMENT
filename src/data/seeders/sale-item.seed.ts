import { SaleItemDB, ProductDB, DepotDB, SaleDB } from "src/models";
import { db as sequelize } from "../../config";

export const saleItemSeed = async () => {
    try {
        console.log("🛒 Generando ventas de Bodega...");

        const sales = await SaleDB.findAll({ attributes: ['sale_id'] });
        const products = await ProductDB.findAll({ attributes: ['product_id', 'name', 'base_price'] });
        const depots = await DepotDB.findAll({ attributes: ['depot_id'] });

        if (sales.length === 0) throw new Error("❌ Corre saleSeed primero.");
        
        const saleIds = sales.map((s: any) => s.sale_id);
        const defaultDepotId = depots.length > 0 ? (depots[0] as any).depot_id : 1;

        // Catálogo con precio de venta (+35% ganancia)
        const catalog = products.map((p: any) => ({
            id: p.product_id,
            name: p.name,
            basePrice: parseFloat(p.base_price),
            sellingPrice: parseFloat(p.base_price) * 1.35 
        }));

        const itemsToCreate = [];
        const existingCombinations = new Set(); 

        for (const saleId of saleIds) {
            // Una compra en bodega suele tener varias cositas (1 a 5 items)
            const numberOfProducts = Math.floor(Math.random() * 5) + 1; 

            for (let k = 0; k < numberOfProducts; k++) {
                const prod = catalog[Math.floor(Math.random() * catalog.length)];

                if (existingCombinations.has(`${saleId}-${prod.id}`)) continue;
                existingCombinations.add(`${saleId}-${prod.id}`);

                // --- LÓGICA DE CANTIDAD DE BODEGA ---
                let qty = 1;
                const name = prod.name.toLowerCase();

                if (name.includes("chupeta") || name.includes("galleta") || name.includes("pepito")) {
                    // Chucherías: La gente compra varias (2 a 6)
                    qty = Math.floor(Math.random() * 5) + 2;
                } 
                else if (name.includes("harina") || name.includes("arroz") || name.includes("azucar")) {
                    // Víveres: 2 o 4 paqueticos
                    qty = Math.floor(Math.random() * 3) + 1;
                }
                else if (name.includes("refresco") || name.includes("malta")) {
                    // Bebidas: 1 o 2
                    qty = Math.floor(Math.random() * 2) + 1;
                }
                else if (prod.basePrice > 1000) {
                     // El producto "Marcos Castellanos" (casi nunca se vende, solo 1)
                     qty = 1;
                     // Hacemos que sea muy raro que aparezca en una venta (1% prob)
                     if (Math.random() > 0.01) continue; 
                }

                itemsToCreate.push({
                    sale_id: saleId,
                    product_id: prod.id,
                    depot_id: defaultDepotId,
                    unit_cost: parseFloat(prod.sellingPrice.toFixed(2)),
                    amount: qty,
                    status: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        // Insertar Items
        const CHUNK_SIZE = 500;
        for (let i = 0; i < itemsToCreate.length; i += CHUNK_SIZE) {
            const chunk = itemsToCreate.slice(i, i + CHUNK_SIZE);
            await SaleItemDB.bulkCreate(chunk);
        }
        console.log(`✅ ${itemsToCreate.length} items vendidos.`);

        // --- SINCRONIZACIÓN DE TOTALES (Fix anterior incluido) ---
        console.log("🔄 Sincronizando totales de VENTAS...");
        const saleItemTable = SaleItemDB.getTableName();
        const saleTable = SaleDB.getTableName();

        const query = `
            UPDATE ${saleTable}
            SET 
                total_usd = (
                    SELECT COALESCE(SUM(amount * unit_cost), 0)
                    FROM ${saleItemTable} AS si
                    WHERE si.sale_id = ${saleTable}.sale_id
                ),
                total_ves = (
                    SELECT COALESCE(SUM(amount * unit_cost), 0)
                    FROM ${saleItemTable} AS si
                    WHERE si.sale_id = ${saleTable}.sale_id
                ) * exchange_rate
            WHERE status = true;
        `;
        await sequelize.query(query);
        console.log("✅ Totales de Ventas actualizados.");

    } catch (error) {
        console.error("❌ Error seed Sale Items:", error);
        throw error;
    }
};