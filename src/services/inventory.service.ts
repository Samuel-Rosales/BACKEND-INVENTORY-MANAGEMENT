import { Transaction } from "sequelize";
import { Op } from "sequelize";
import { 
    DepotDB,
    ProductDB, 
    StockGeneralDB, 
    StockLotDB 
} from "../models";
import { ProductInterface } from "@/interfaces";

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

    public async addStockAjust(
        product_id: number,
        depot_id: number,
        amount: number,
        date_expiration: Date,
        t: Transaction
    ) {
        // 1. Buscar el producto para saber si es perecedero
        const product = await ProductDB.findByPk(product_id, { transaction: t });
        if (!product) {
            throw new Error(`Producto ${product_id} no encontrado.`);
        }

        const product_json = product.toJSON() as ProductInterface;

        const depot = await DepotDB.findByPk(depot_id, { transaction: t });
        
        if (!depot) {
            return {
                status: 404,
                message: "Depot not found",
                data: null,
            };
        }

        // --- Lógica de bifurcación basada en el flag 'perishable' ---
        if (product_json.perishable) {
            // --- ES PERECEDERO ---
            // Crea un nuevo lote en StockLot
            await StockLotDB.create({
                product_id: product_id,
                depot_id: depot_id,
                expiration_date: date_expiration,
                amount: amount,
                cost_lot: 0 // Asumimos costo 0 para ajustes
            }, { transaction: t });

            /*const stock = await StockLotDB.findOne({
                where: {
                    stock_lot_id: stock_lot_id,
                    depot_id: depot_id
                },
                transaction: t
            });

            if (stock) {
                // Suma la cantidad al stock existente
                await stock.increment('amount', { by: amount, transaction: t });
            }*/
        } else {
            
            // --- NO ES PERECEDERO ---
            // Busca la fila de stock (product_id, depot_id) o la crea si no existe
            const [stock, created] = await StockGeneralDB.findOrCreate({
                where: {
                    product_id: product_id,
                    depot_id: depot_id
                },
                defaults: { amount: 0 }, // Si la crea, empieza en 0
                transaction: t
            });
            
            // Suma la cantidad al stock existente
            await stock.increment('amount', { by: amount, transaction: t });
        }
    }

    public async deductStockAjust(
        product_id: number,
        depot_id: number,
        amount: number,
        stock_lot_id: number,
        t: Transaction
    ) {
        // 1. Buscar el producto
        const product = await ProductDB.findByPk(product_id, { transaction: t });
        if (!product) {
            throw new Error(`Producto ${product_id} no encontrado.`);
        }

        const productJson = product.toJSON() as ProductInterface;

        let amountToDeduct = amount;

        if (productJson.perishable) {
            
            // --- LÓGICA FEFO (Perecederos) ---

            // 1. Buscar todos los lotes con stock, ordenados por fecha (FEFO)
            const lot = await StockLotDB.findOne({
                where: {
                    stock_lot_id: stock_lot_id,
                    depot_id: depot_id,
                    amount: { [Op.gt]: 0 } // Solo lotes con stock
                },
                order: [['expiration_date', 'ASC']], // First-Expired, First-Out
                transaction: t,
                lock: t.LOCK.UPDATE // Bloquea las filas para evitar ventas duplicadas
            });

            if (!lot) {
                throw new Error(`Lote ${stock_lot_id} no encontrado en el depósito ${depot_id}.`);
            }

            const lotJson = lot.toJSON();

            // 2. Verificar si hay suficiente stock total
            const totalStock = lotJson.amount || 0;
            if (totalStock < amountToDeduct) {
                throw new Error(`Stock insuficiente para ${(product as any).name}. Stock: ${totalStock}, Solicitado: ${amountToDeduct}`);
            }

            // 3. Descontar del lote
            await lot.decrement('amount', { by: amountToDeduct, transaction: t });

        } else {
            
            // --- LÓGICA SIMPLE (No Perecederos) ---
            
            // 1. Buscar la fila de stock
            const stock = await StockGeneralDB.findOne({
                where: {
                    product_id: productJson.product_id,
                    depot_id: depot_id
                },
                transaction: t,
                lock: t.LOCK.UPDATE // Bloquea la fila
            });

            const stockJson = stock?.toJSON();

            // 2. Verificar stock
            if (!stock || stockJson.amount < amountToDeduct) {
                throw new Error(`Stock insuficiente para ${productJson.name}. Stock: ${stockJson.amount || 0}, Solicitado: ${amountToDeduct}`);
            }

            // 3. Descontar
            await stock.decrement('amount', { by: amountToDeduct, transaction: t });
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
        t: Transaction,
        specific_stock_lot_id?: number | null // <--- NUEVO PARAMETRO OPCIONAL
    ) {
        // 1. Buscar el producto
        const product = await ProductDB.findByPk(item.product_id, { transaction: t });
        if (!product) {
            throw new Error(`Producto ${item.product_id} no encontrado.`);
        }

        let amountToDeduct = item.amount;

        if ((product as any).perishable) {
            
            // --- CASO 1: EL USUARIO ELIGIÓ UN LOTE ESPECÍFICO ---
            if (specific_stock_lot_id) {
                const specificLot = await StockLotDB.findOne({
                    where: {
                        stock_lot_id: specific_stock_lot_id,
                        product_id: item.product_id,
                        depot_id: depot_id // Seguridad: asegurar que el lote pertenece a ese depósito
                    },
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (!specificLot) {
                    throw new Error(`El lote seleccionado (ID: ${specific_stock_lot_id}) no existe o no pertenece a este depósito.`);
                }

                if ((specificLot as any).amount < amountToDeduct) {
                    throw new Error(`Stock insuficiente en el lote seleccionado. Disp: ${(specificLot as any).amount}, Solicitado: ${amountToDeduct}`);
                }

                // Descuento directo y estricto del lote seleccionado
                await specificLot.decrement('amount', { by: amountToDeduct, transaction: t });

            } else {
                console.log("No specific lot selected, applying FEFO logic.");
                // --- CASO 2: NO SE ELIGIÓ LOTE -> APLICAR FEFO AUTOMÁTICO (Tu lógica original) ---
                
                // 1. Buscar todos los lotes con stock, ordenados por fecha (FEFO)
                const lots = await StockLotDB.findAll({
                    where: {
                        product_id: item.product_id,
                        depot_id: depot_id,
                        amount: { [Op.gt]: 0 } 
                    },
                    order: [['expiration_date', 'ASC']], 
                    transaction: t,
                    lock: t.LOCK.UPDATE 
                });

                // 2. Verificar si hay suficiente stock total
                const totalStock = lots.reduce((sum, lot) => sum + (lot as any).amount, 0);
                if (totalStock < amountToDeduct) {
                    throw new Error(`Stock total insuficiente para ${(product as any).name}. Stock Global: ${totalStock}, Solicitado: ${amountToDeduct}`);
                }

                // 3. Descontar en cascada
                for (const lot of lots) {
                    if (amountToDeduct <= 0) break;

                    const lotAmount = (lot as any).amount;
                    const deduct = Math.min(lotAmount, amountToDeduct);
                    
                    await lot.decrement('amount', { by: deduct, transaction: t });
                    amountToDeduct -= deduct;
                }
            }

        } else {
            // --- LÓGICA SIMPLE (No Perecederos - Igual que antes) ---
            
            const stock = await StockGeneralDB.findOne({
                where: {
                    product_id: item.product_id,
                    depot_id: depot_id
                },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!stock || (stock as any).amount < amountToDeduct) {
                throw new Error(`Stock insuficiente para ${(product as any).name}. Stock: ${(stock as any)?.amount || 0}, Solicitado: ${amountToDeduct}`);
            }

            await stock.decrement('amount', { by: amountToDeduct, transaction: t });
        }
    }
}

// Exportamos una instancia única (Singleton) del servicio
export const inventoryService = new InventoryService();