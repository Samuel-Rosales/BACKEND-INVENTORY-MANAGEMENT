import { SaleDB, ClientDB, TypePaymentDB, UserDB, SaleItemDB, MovementDB, ProductDB, DepotDB, StockGeneralDB, StockLotDB } from "../models";
import { ProductInterface, SaleInterface, StockGeneralInterface, StockLotInterface } from "../interfaces";

import { inventoryService, NotificationServices, ExchangeRateServices } from "../services";
import { db } from "../config/sequelize.config";

class SaleService {

    async getAll() {
        try {
            const sales = await SaleDB.findAll({
                include: [
                    { model: ClientDB, as: "client", attributes: ['name'] },
                    { model: UserDB, as: "user", attributes: ['name'] },
                    { model: TypePaymentDB, as: "type_payment", attributes: ['name'] },
                ],
            });

            if (sales.length === 0) {
                return {
                    status: 404,
                    message: "No sales found",
                    data: null
                };
            }

            const salesData = sales.map(sale => { {
                const saleData = sale.toJSON();
                return {
                    ...saleData,
                    client: saleData.client?.name || null,
                    user: saleData.user?.name || null,
                    type_payment: saleData.type_payment?.name || null,
                };
            }});


            return { 
                status: 200,
                message: "Sales obtained correctly", 
                data: salesData,   
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
                    { model: ClientDB, as: "client", attributes: ['name'] },
                    { model: UserDB, as: "user", attributes: ['name'] },
                    { model: TypePaymentDB, as: "type_payment", attributes: ['name'] },
                    { 
                        model: SaleItemDB, as: "sale_items", include: [
                            { model: ProductDB, as: "product", attributes: ['name'] },
                            { model: DepotDB, as: "depot", attributes: ['name'] }
                        ] 
                    },
                ]
            });

            if (!sale) {
                return {
                    status: 404,
                    message: "Sale not found",
                    data: null
                };
            }

            const saleData = sale.toJSON();

            const flattenedSale = {
                ...saleData,
                client: saleData.client?.name || null,
                user: saleData.user?.name || null,
                type_payment: saleData.type_payment?.name || null,
                sale_items: saleData.sale_items?.map((item: any) => ({
                    ...item,
                    product: item.product?.name || null,
                    depot: item.depot?.name || null
                }))
            };

            return {
                status: 200,
                message: "Sale obtained correctly",
                data: flattenedSale,
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

    async create(sale: SaleInterface) { 
        
        const t = await db.transaction();

        const notificationsToSend: { id: string, name: string, stock: number }[] = [];

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

                const producto = await ProductDB.findByPk(item.product_id, { transaction: t, include: [
                    { model: StockGeneralDB, as: "stock_generals" },
                    { model: StockLotDB, as: "stock_lots" },
                ] });
                if (!producto) {
                    throw new Error(`Producto con id ${item.product_id} no encontrado.`);
                }

                // Obtenemos el stock actual ANTES de la resta
                const simpleProduct = producto.toJSON() as ProductInterface & { stock_generals: StockGeneralInterface[], stock_lots: StockLotInterface[] };
                
                let currentStock = 0;
    
                if (!simpleProduct.perishable) {
        
                    currentStock = simpleProduct.stock_generals.reduce((accumulator, stock) =>{
                        return accumulator + stock.amount;
                    }, 0);
                } else {
    
                    currentStock = simpleProduct.stock_lots.reduce((accumlator, stock) =>{
                        return accumlator + stock.amount;
                    },0);
                }
                const unit_cost_usd = parseFloat(producto.get('base_price') as string);
                
                // Llamada a InventoryService (asumimos que esto actualiza la DB)
                await inventoryService.deductStock(item, depot_id, t, item.stock_lot_id);

                // CALCULAR EL NUEVO STOCK EN MEMORIA
                // Es importante calcularlo aquí porque inventoryService corre dentro de la transacción
                const newStock = currentStock - item.amount;
                const MIN_STOCK = parseFloat(producto.get('min_stock') as string); // O producto.get('min_stock') si lo tienes en la DB

                // --- LÓGICA DE NOTIFICACIÓN (Sin enviar aún) ---
                if (newStock <= MIN_STOCK) {
                    console.log(`[SaleService] Producto ${producto.get('name')} (ID: ${item.product_id}) en stock crítico: ${newStock} unidades restantes.`);
                    notificationsToSend.push({
                        id: String(item.product_id),
                        name: (producto.get('name') as string),
                        stock: newStock
                    });
                }

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
                }, { transaction: t });
            }

            // 8. Confirmar
            await t.commit();

            if (notificationsToSend.length > 0) {
                console.log(`[SaleService] Enviando ${notificationsToSend.length} alertas de stock...`);
                
                // Opción A: Fire and Forget (No esperamos a que termine para responder al cliente)
                notificationsToSend.forEach(n => {
                    NotificationServices.sendLowStockAlert(n.id, n.name, n.stock);
                });
            }

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
}

export const SaleServices = new SaleService();