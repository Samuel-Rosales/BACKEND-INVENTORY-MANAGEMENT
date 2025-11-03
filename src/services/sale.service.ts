import { SaleDB, ClientDB, TypePaymentDB, UserDB, SaleItemDB, MovementDB } from "../models";
import { SaleInterface } from "../interfaces";

import { inventoryService } from "./inventory.service";
import { db } from "../config/sequelize.config";

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

            const { createdAt, updatedAt, sale_id, ...saleData  } = sale;

            // 1. Crear la cabecera de la Venta (no tiene depot_id)
            const newSale = await SaleDB.create(saleData, { transaction: t });

            const items = (sale as any).sale_items ?? []; // 2. Extraer los ítems de la venta

            // 3. Procesar cada ítem
            for (const item of items) {

                // 4. El depot_id (origen) se saca de CADA item
                const depot_id = item.depot_id;
                if (!depot_id) {
                    throw new Error(`El item ${item.product_id} debe especificar un almacén de origen (depot_id).`);
                }
                
                // 5. Llamar al InventoryService para restar stock
                await inventoryService.deductStock(
                    item, // item = { product_id, amount, depot_id, ... }
                    depot_id, 
                    t
                );

                // 6. Crear el detalle de la venta (esto SÍ coincide con tu modelo)
                await SaleItemDB.create({
                    sale_id: (newSale as any).sale_id,
                    product_id: item.product_id,
                    depot_id: depot_id, // Tu SaleDetailFactory SÍ tiene depot_id
                    amount: item.amount,
                    unit_cost: item.unit_cost 
                }, { transaction: t });
                
                // 7. Registrar el movimiento
                await MovementDB.create({
                    type: 'Venta',
                    depot_id: depot_id, 
                    product_id: item.product_id,
                    amount: item.amount,
                    observation: `Venta ID: ${(newSale as any).sale_id}`,
                    moved_at: new Date(),
                }, { transaction: t });
            }

            // 8. Confirmar
            await t.commit();

            return { status: 201, message: "Sale created successfully", data: newSale };

        } catch (error) {
            // 9. Revertir
            await t.rollback();
            
            if (error instanceof Error) {
                return {
                    status: 400, // Bad Request (Error del cliente)
                    message: error.message, 
                    data: null,
                };
            }
            return {
                status: 500, // Internal Server Error
                message: "Interal server error",
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