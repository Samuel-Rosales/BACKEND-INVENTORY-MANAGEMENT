import { PurchaseLotItemDB, PurchaseDB, ProductDB } from "../models";
import { PurchaseLotItemInterface } from "../interfaces";

class PurchaseLotItemService {
    async getAll() {
        try {
            const purchasesItems = await PurchaseLotItemDB.findAll({
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Purchase lot items obtained correctly", 
                data: purchasesItems,   
            };
        } catch (error) {
            console.error("Error fetching purchase lot items: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(purchase_item_id: number) {
        try {
            const purchaseLotItem = await PurchaseLotItemDB.findByPk(purchase_item_id, {
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Purchase lot item obtained correctly",
                data: purchaseLotItem,
            };
        } catch (error) {
            console.error("Error fetching purchase lot item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(purchaseLotItem: PurchaseLotItemInterface) {
        try {
            const { createdAt, updatedAt, ...purchaseLotItemData  } = purchaseLotItem;

            const newPurchaseLotItem = await PurchaseLotItemDB.create(purchaseLotItemData);

            return {
                status: 201,
                message: "Purchase lot item created successfully",
                data: newPurchaseLotItem,
            };
            } catch (error) { 
            console.error("Error creating purchase lot item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(purchase_item_id: number, purchaseLotItem: Partial<PurchaseLotItemInterface>) {
        try {
            const { createdAt, updatedAt, purchase_lot_id: _, ... purchaseLotItemData} = purchaseLotItem;

            await PurchaseLotItemDB.update(purchaseLotItemData, { where: { purchase_item_id } });

            const updatedPurchaseLotItem = await PurchaseLotItemDB.findByPk(purchase_item_id);

            return {
                status: 200,
                message: "Purchase lot item update correctly",
                data: updatedPurchaseLotItem,
            };
        } catch (error) {
            console.error("Error updating purchase lot item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (purchase_item_id: number) {
        try {
            await PurchaseLotItemDB.destroy({ where: {purchase_item_id} });

            return { 
                status: 200,
                message: "Purchase lot item deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting purchase lot item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await PurchaseLotItemDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const PurchaseLotItemServices = new PurchaseLotItemService();