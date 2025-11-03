import { Transaction } from "sequelize";
import { Op } from "sequelize";
import { 
    ProductDB, 
    StockGeneralDB, 
    StockLotDB 
} from "../models";

// Interfaces para tipar los datos
// (Basadas en tus modelos de 'Purchase Items')
interface PurchaseItemInput {
    product_id: number;
    amount: number;
    unit_cost: number;
    expiration_date?: Date; // Opcional, solo para perecederos
}

// (Basada en tu modelo de 'Sale Items')
interface SaleItemInput {
    product_id: number;
    amount: number;
}

class InventoryService {

    /**
     * -----------------------------------------------------------------
     * AÑADE STOCK (Usado por Compras o Devoluciones)
     * -----------------------------------------------------------------
     * Añade stock al inventario.
     */
    public async addStock(
        item: PurchaseItemInput, 
        depot_id: number, 
        t: Transaction
    ) {
        // 1. Buscar el producto para saber si es perecedero
        const product = await ProductDB.findByPk(item.product_id, { transaction: t });
        if (!product) {
            throw new Error(`Producto ${item.product_id} no encontrado.`);
        }

        // --- Lógica de bifurcación basada en el flag 'perishable' ---
        if ((product as any).perishable) {
            
            // --- ES PERECEDERO ---
            // Valida que el item tenga fecha de vencimiento
            if (!item.expiration_date) {
                throw new Error(`Producto perecedero ${(product as any).name} requiere una fecha de vencimiento.`);
            }
            
            // Crea un nuevo lote en StockLot
            // Nota: usamos 'item.unit_cost' para poblar 'cost_lot'
            await StockLotDB.create({
                product_id: item.product_id,
                depot_id: depot_id,
                expiration_date: item.expiration_date,
                amount: item.amount,
                cost_lot: item.unit_cost // ¡Conexión clave!
            }, { transaction: t });

        } else {
            
            // --- NO ES PERECEDERO ---
            // Busca la fila de stock (product_id, depot_id) o la crea si no existe
            const [stock, created] = await StockGeneralDB.findOrCreate({
                where: {
                    product_id: item.product_id,
                    depot_id: depot_id
                },
                defaults: { amount: 0 }, // Si la crea, empieza en 0
                transaction: t
            });
            
            // Suma la cantidad al stock existente
            await stock.increment('amount', { by: item.amount, transaction: t });
        }
    }

    /**
     * -----------------------------------------------------------------
     * RESTA STOCK (Usado por Ventas o Ajustes de Salida)
     * -----------------------------------------------------------------
     * Descuenta stock del inventario implementando FEFO.
     */
    public async deductStock(
        item: SaleItemInput, 
        depot_id: number, 
        t: Transaction
    ) {
        // 1. Buscar el producto
        const product = await ProductDB.findByPk(item.product_id, { transaction: t });
        if (!product) {
            throw new Error(`Producto ${item.product_id} no encontrado.`);
        }

        let amountToDeduct = item.amount;

        if ((product as any).perishable) {
            
            // --- LÓGICA FEFO (Perecederos) ---

            // 1. Buscar todos los lotes con stock, ordenados por fecha (FEFO)
            const lots = await StockLotDB.findAll({
                where: {
                    product_id: item.product_id,
                    depot_id: depot_id,
                    amount: { [Op.gt]: 0 } // Solo lotes con stock
                },
                order: [['expiration_date', 'ASC']], // First-Expired, First-Out
                transaction: t,
                lock: t.LOCK.UPDATE // Bloquea las filas para evitar ventas duplicadas
            });

            // 2. Verificar si hay suficiente stock total
            const totalStock = lots.reduce((sum, lot) => sum + (lot as any).amount, 0);
            if (totalStock < amountToDeduct) {
                throw new Error(`Stock insuficiente para ${(product as any).name}. Stock: ${totalStock}, Solicitado: ${amountToDeduct}`);
            }

            // 3. Descontar de los lotes, uno por uno
            for (const lot of lots) {
                if (amountToDeduct <= 0) break;

                const lotAmount = (lot as any).amount;
                const deduct = Math.min(lotAmount, amountToDeduct);
                
                await lot.decrement('amount', { by: deduct, transaction: t });
                amountToDeduct -= deduct;
            }

        } else {
            
            // --- LÓGICA SIMPLE (No Perecederos) ---
            
            // 1. Buscar la fila de stock
            const stock = await StockGeneralDB.findOne({
                where: {
                    product_id: item.product_id,
                    depot_id: depot_id
                },
                transaction: t,
                lock: t.LOCK.UPDATE // Bloquea la fila
            });

            // 2. Verificar stock
            if (!stock || (stock as any).amount < amountToDeduct) {
                throw new Error(`Stock insuficiente para ${(product as any).name}. Stock: ${(stock as any)?.amount || 0}, Solicitado: ${amountToDeduct}`);
            }

            // 3. Descontar
            await stock.decrement('amount', { by: amountToDeduct, transaction: t });
        }
    }
}

// Exportamos una instancia única (Singleton) del servicio
export const inventoryService = new InventoryService();