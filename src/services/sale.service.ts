import { SaleDB, ClientDB, TypePaymentDB, UserDB, SaleItemDB, MovementDB, ProductDB } from "../models";
import { SaleInterface } from "../interfaces";

import { inventoryService } from "./inventory.service";
import { db } from "../config/sequelize.config";

import { ExchangeRateServices } from "./exchange-rate.service"; // Para obtener la TASA

class SaleService {

    async getAll() {
        try {
            const sales = await SaleDB.findAll({
                include: [
                    { model: ClientDB, as: "client" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                    { model: SaleItemDB, as: "sale_items" },
                ],
            });

            return { 
                status: 200,
                message: "Sales obtained correctly", 
                data: sales,   
            };
        } catch (error) {
            console.error("Error fetching sales: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(sale_id: number) {
        try {
            const sale = await SaleDB.findByPk(sale_id, {
                include: [
                    { model: ClientDB, as: "client" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                    { model: SaleItemDB, as: "sale_items" },
                ]
            });

            return {
                status: 200,
                message: "Sale obtained correctly",
                data: sale,
            };
        } catch (error) {
            console.error("Error fetching Sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(sale: SaleInterface) { // Idealmente: items: SaleDetailInterface[]
        
        const t = await db.transaction(); 

        try {

            const rateResponse = await ExchangeRateServices.getCurrentRate();

            if (rateResponse.status !== 200) {
                throw new Error(rateResponse.message);
            }
            
            const rateModel = rateResponse.data;

            if (!rateModel) {
                throw new Error("Tasa de cambio no disponible.");
            }
            const exchange_rate = parseFloat(rateModel.get('rate') as string);
            if (isNaN(exchange_rate)) {
                throw new Error('Tasa de cambio inválida (NaN).');
            }

            const items = (sale as any).sale_items ?? [];
            if (items.length === 0) {
                throw new Error('La venta debe tener al menos un ítem.');
            }

            let totalVentaUSD = 0;
            const itemsProcesados = [];// 2. Extraer los ítems de la venta

            // 3. Procesar cada ítem
            for (const item of items) {

                // 4. El depot_id (origen) se saca de CADA item
                const depot_id = item.depot_id;
                if (!depot_id) {
                    throw new Error(`El item ${item.product_id} debe especificar un almacén de origen (depot_id).`);
                }

                const producto = await ProductDB.findByPk(item.product_id, { transaction: t });
                if (!producto) {
                    throw new Error(`Producto con id ${item.product_id} no encontrado.`);
                }
                const unit_cost_usd = parseFloat(producto.get('base_price') as string); // Este es el precio AUTORITATIVO
                
                // 5. Llamar al InventoryService para restar stock
                await inventoryService.deductStock(
                    item, // item = { product_id, amount, depot_id, ... }
                    depot_id, 
                    t
                );

                totalVentaUSD += unit_cost_usd * item.amount;

                // --- 2d. GUARDAR ITEM PROCESADO ---
                itemsProcesados.push({
                    product_id: item.product_id,
                    depot_id: depot_id,
                    amount: item.amount,
                    unit_cost: unit_cost_usd // Usamos el precio SEGURO de la DB
                });
            }

            const totalVentaVES = totalVentaUSD * exchange_rate;

            const { client_ci, user_ci, type_payment_id, sold_at } = sale;

            const newSale = await SaleDB.create({
                client_ci,
                user_ci, // NOTA: Es más seguro obtener esto de req.user (del token)
                type_payment_id,
                sold_at: sold_at || new Date(),
                status: true,
                // --- ¡AQUÍ ESTÁ LA MAGIA! ---
                total_usd: totalVentaUSD,
                exchange_rate: exchange_rate,
                total_ves: parseFloat(totalVentaVES.toFixed(2))
            }, { transaction: t });

            const newSaleId = (newSale as any).sale_id;

            for (const itemData of itemsProcesados) {
                
                // 6. Crear el detalle de la venta (SaleItem)
                await SaleItemDB.create({
                    ...itemData,
                    sale_id: newSaleId,
                }, { transaction: t });
                
                // 7. Registrar el movimiento (Tu lógica existente)
                await MovementDB.create({
                    type: 'Venta',
                    depot_id: itemData.depot_id, 
                    user_ci: user_ci,
                    product_id: itemData.product_id,
                    amount: itemData.amount,
                    observation: `Venta ID: ${newSaleId}`,
                    moved_at: new Date(),
                }, { transaction: t });
            }

            // 8. Confirmar
            await t.commit();

            return { status: 201, message: "Sale created successfully", data: newSale };

        } catch (error) {
            // 9. Revertir
            await t.rollback();
            
            const message = (error instanceof Error) ? error.message : "Interal server error";
            return {
                status: 400, // 400 (Bad Request) es mejor para errores de lógica de negocio
                message: message, 
                data: null,
            };
        }
    }

    async update(sale_id: number, sale: Partial<SaleInterface>) {
        try {
            const { createdAt, updatedAt, sale_id: _, ... saleData} = sale;

            await SaleDB.update(saleData, { where: { sale_id } });

            const updatedSale = await SaleDB.findByPk(sale_id);

            return {
                status: 200,
                message: "Sale update correctly",
                data: updatedSale,
            };
        } catch (error) {
            console.error("Error updating sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (sale_id: number) {
        try {
            await SaleDB.destroy({ where: {sale_id} });

            return { 
                status: 200,
                message: "Sale deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await SaleDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/
}

export const SaleServices = new SaleService();