import { PurchaseDB, ProviderDB, TypePaymentDB, UserDB, PurchaseGeneralItemDB, PurchaseLotItemDB, ProductDB, MovementDB } from "../models";
import { PurchaseInterface } from "../interfaces";
import { inventoryService } from "./inventory.service";
import { db } from "../config/sequelize.config";

class PurchaseService {

    async getAll() {
        try {
            const purchases = await PurchaseDB.findAll({
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
            
            const { createdAt, updatedAt, purchase_id, ...purchaseData  } = purchase;

            const newPurchase = await PurchaseDB.create(purchaseData, { transaction: t });

            // 2. Preparar y procesar cada ítem
            const generalItems = (purchase as any).purchase_general_items ?? [];
            const lotItems = (purchase as any).purchase_lot_items ?? [];
            const items = [...generalItems, ...lotItems];

            for (const item of items) {

                // El depot_id ahora se saca de CADA item en el bucle
                const depot_id = item.depot_id;
                if (!depot_id) {
                    throw new Error(`El item con product_id ${item.product_id} no tiene un almacén de destino (depot_id).`);
                }
                
                // 3. ¡LLAMADA CLAVE!
                // Llama al InventoryService para que maneje el stock.
                // Le pasamos el item, el almacén (del item) y la transacción.
                await inventoryService.addStock(
                    item, // item contiene { product_id, amount, unit_cost, expiration_date?, depot_id }
                    depot_id, 
                    t
                );

                // 4. Crear el detalle de compra (General o Lote)
                if (item.expiration_date) {
                    await PurchaseLotItemDB.create({
                        purchase_id: (newPurchase as any).purchase_id,
                        product_id: item.product_id,
                        depot_id: depot_id, // <-- CAMBIO AÑADIDO (guardamos el destino)
                        amount: item.amount,
                        unit_cost: item.unit_cost,
                        expiration_date: item.expiration_date
                    }, { transaction: t });
                } else {
                     await PurchaseGeneralItemDB.create({
                        purchase_id: (newPurchase as any).purchase_id,
                        product_id: item.product_id,
                        depot_id: depot_id, // <-- CAMBIO AÑADIDO (guardamos el destino)
                        amount: item.amount,
                        unit_cost: item.unit_cost
                    }, { transaction: t });
                }
                
                // 5. Registrar el movimiento (Auditoría)
                await MovementDB.create({
                    type: 'Compra',        // <-- CORREGIDO
                    depot_id: depot_id,               // <-- CORREGIDO
                    product_id: item.product_id,      // <-- CORREGIDO
                    amount: item.amount,              // <-- CORREGIDO
                    observation: `Compra ID ${(newPurchase as any).purchase_id}`, // <-- AÑADIDO Y OBLIGATORIO
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
                
                // 7. Si algo falló (ej. un item no tenía depot_id)
                await t.rollback();

                // Si el error fue uno que nosotros lanzamos (ej. "depot_id no tiene...")
                // lo tratamos como un error del cliente (400).
                if (error instanceof Error) {
                    return {
                        status: 400, // <-- 400 Bad Request
                        message: error.message, // <-- Muestra el error real al usuario
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

    /*const purchases = await PurchaseDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const PurchaseServices = new PurchaseService();