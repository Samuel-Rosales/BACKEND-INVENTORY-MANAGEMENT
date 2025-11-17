import { PurchaseDB, ProviderDB, TypePaymentDB, UserDB, PurchaseGeneralItemDB, PurchaseLotItemDB, ProductDB, MovementDB } from "../models";
import { ProductInterface, PurchaseInterface } from "../interfaces";
import { inventoryService } from "./inventory.service";
import { db } from "../config/sequelize.config";
import { ExchangeRateServices } from "./exchange-rate.service";

class PurchaseService {

    async getAll() {
        try {
            const purchases = await PurchaseDB.findAll({
                include: [
                    { model: ProviderDB, as: "provider" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" }
                ],
            });

            return { 
                status: 200,
                message: "Purchases obtained correctly", 
                data: purchases,   
            };
        } catch (error) {
            console.error("Error fetching purchases: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(purchase_id: number) {
        try {
            const purchase = await PurchaseDB.findByPk(purchase_id, {
                include: [
                    { model: ProviderDB, as: "provider" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                    { model: PurchaseGeneralItemDB, as: "purchase_general_items", 
                        include: [ 
                            { 
                                model: ProductDB, 
                                as: "product" 
                            }
                        ]
                    }, 
                    { model: PurchaseLotItemDB, as: "purchase_lot_items", 
                         include: [ 
                            { 
                                model: ProductDB, 
                                as: "product" 
                            }
                        ]
                    },
                ]
            });

            return {
                status: 200,
                message: "Purchase obtained correctly",
                data: purchase,
            };
        } catch (error) {
            console.error("Error fetching purchase: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(purchase: PurchaseInterface) {

        const t = await db.transaction();

        try {
            const rateResponse = await ExchangeRateServices.getCurrentRate();
            if (rateResponse.status !== 200) {
                throw new Error(rateResponse.message); // Lanza error si no hay tasa
            }
            const rateModel = rateResponse.data;
            if (!rateModel) { // Doble chequeo por si acaso
                throw new Error("Tasa de cambio no disponible.");
            }
            const exchange_rate = parseFloat(rateModel.get('rate') as string);
            if (isNaN(exchange_rate)) {
                throw new Error('Tasa de cambio inválida (NaN).');
            }

            const items = (purchase as PurchaseInterface).purchase_items;
 
            if (items.length === 0) {
                throw new Error('La compra debe tener al menos un ítem.');
            }

            let totalCompraUSD = 0;
            const itemsProcesados = [];

            for (const item of items) {

                // El depot_id ahora se saca de CADA item en el bucle
                const depot_id = item.depot_id;
                if (!depot_id) {
                    throw new Error(`El item con product_id ${item.product_id} no tiene un almacén de destino (depot_id).`);
                }
                
                // Validar que el producto existe
                const product = await ProductDB.findByPk(item.product_id, { transaction: t, attributes: ['perishable', 'name'] }) as ProductInterface | null;
                if (!product) {
                    throw new Error(`Producto con id ${item.product_id} no encontrado.`);
                }

                // Validar costo (¡importante!)
                if (!item.unit_cost || item.unit_cost <= 0) {
                    throw new Error(`Costo unitario (unit_cost) inválido para el producto ${item.product_id}.`);
                }

                // Validar lógica de perecedero
                if (product.perishable) {
                    if (!('expiration_date' in item) || !item.expiration_date) {
                        throw new Error(`Producto perecedero ${product.name} requiere una fecha de vencimiento.`);
                    }
                }
                const isPerishable = product.perishable;

                // --- 5. CALCULAR TOTAL (USD) ---
                totalCompraUSD += item.unit_cost * item.amount;

                // Guardar para el Bucle 2
                itemsProcesados.push({ ...item, is_perishable: isPerishable });
            }

            // --- 6. CALCULAR TOTAL (VES) ---
            const totalCompraVES = totalCompraUSD * exchange_rate;

            // --- 7. CREAR LA CABECERA DE COMPRA (AHORA SÍ) ---
            const { provider_id, user_ci, type_payment_id, bought_at, status } = purchase;
            const newPurchase = await PurchaseDB.create({
                provider_id,
                user_ci,
                type_payment_id,
                bought_at: bought_at || new Date(),
                status: status || 'Pendiente',
                active: true,
                // --- TOTALES CONGELADOS ---
                total_usd: totalCompraUSD,
                exchange_rate: exchange_rate,
                total_ves: parseFloat(totalCompraVES.toFixed(2))
            }, { transaction: t });

            const newPurchaseId = (newPurchase as any).purchase_id;

            for (const item of itemsProcesados) {

                // 8a. Añadir Stock (Tu lógica existente, ¡es correcta!)
                 await inventoryService.addStock(
                    item, 
                    item.depot_id, 
                    t
                );

                // 8b. Crear el detalle de compra (General o Lote)
                if ('expiration_date' in item && item.is_perishable) { 
                    await PurchaseLotItemDB.create({
                        purchase_id: newPurchaseId,
                        product_id: item.product_id,
                        depot_id: item.depot_id,
                        amount: item.amount,
                        unit_cost: item.unit_cost,
                        expiration_date: item.expiration_date
                    }, { transaction: t });
                } else {
                     await PurchaseGeneralItemDB.create({
                        purchase_id: newPurchaseId,
                        product_id: item.product_id,
                        depot_id: item.depot_id,
                        amount: item.amount,
                        unit_cost: item.unit_cost
                    }, { transaction: t });
                }

                // 8c. Registrar el movimiento (Auditoría)
                await MovementDB.create({
                    type: 'Compra',
                    depot_id: item.depot_id,
                    product_id: item.product_id,
                    amount: item.amount,
                    observation: `Compra ID ${newPurchaseId}`, 
                    Type: `Compra`,
                    moved_at: new Date(),
                }, { transaction: t });
            }

            // 6. Si todo salió bien
            await t.commit();

            return {
                status: 201,
                message: "Purchase created successfully",
                data: newPurchase,
            };
            } catch (error) { 
                console.error("Error creating purchase: ", error);
                
                await t.rollback();

                if (error instanceof Error) {
                    return {
                        status: 400,
                        message: error.message,
                        data: null,
                    };
                }
                
                return {
                    status: 500,
                    message: "Internal server error",
                    data: null,
                };
        }
    }

    async update(purchase_id: number, purchase: Partial<PurchaseInterface>) {
        try {
            const { createdAt, updatedAt, purchase_id: _, ... purchaseData} = purchase;

            await PurchaseDB.update(purchaseData, { where: { purchase_id } });

            const updatedPurchase = await PurchaseDB.findByPk(purchase_id);

            return {
                status: 200,
                message: "Purchase update correctly",
                data: updatedPurchase,
            };
        } catch (error) {
            console.error("Error updating purchase: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (purchase_id: number) {
        try {
            await PurchaseDB.destroy({ where: {purchase_id} });

            return { 
                status: 200,
                message: "Purchase deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting purchase: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const PurchaseServices = new PurchaseService();