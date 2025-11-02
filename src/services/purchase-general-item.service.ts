import { PurchaseGeneralItemDB, PurchaseDB, ProductDB } from "../models";
import { PurchaseGeneralItemInterface } from "../interfaces";

class PurchaseGeneralItemService {
    async getAll() {
        try {
            const purchasesGeneralItems = await PurchaseGeneralItemDB.findAll({
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Purchase general items obtained correctly", 
                data: purchasesGeneralItems,   
            };
        } catch (error) {
            console.error("Error fetching purchase general items: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(purchase_item_id: number) {
        try {
            const purchaseGeneralItem = await PurchaseGeneralItemDB.findByPk(purchase_item_id, {
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Purchase general item obtained correctly",
                data: purchaseGeneralItem,
            };
        } catch (error) {
            console.error("Error fetching purchase general item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(purchaseGeneralItem: PurchaseGeneralItemInterface) {
        try {
            const { createdAt, updatedAt, ...purchaseGeneralItemData  } = purchaseGeneralItem;

            const newPurchaseGeneralItem = await PurchaseGeneralItemDB.create(purchaseGeneralItemData);

            return {
                status: 201,
                message: "Purchase general item created successfully",
                data: newPurchaseGeneralItem,
            };
            } catch (error) { 
            console.error("Error creating purchase general item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(purchase_item_id: number, purchaseGeneralItem: Partial<PurchaseGeneralItemInterface>) {
        try {
            const { createdAt, updatedAt, purchase_general_id: _, ... purchaseGeneralItemData} = purchaseGeneralItem;

            await PurchaseGeneralItemDB.update(purchaseGeneralItemData, { where: { purchase_item_id } });

            const updatedPurchaseGeneralItem = await PurchaseGeneralItemDB.findByPk(purchase_item_id);

            return {
                status: 200,
                message: "Purchase general item update correctly",
                data: updatedPurchaseGeneralItem,
            };
        } catch (error) {
            console.error("Error updating purchase general item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (purchase_item_id: number) {
        try {
            await PurchaseGeneralItemDB.destroy({ where: {purchase_item_id} });

            return { 
                status: 200,
                message: "Purchase general item deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting purchase general item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await PurchaseGeneralItemDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const PurchaseGeneralItemServices = new PurchaseGeneralItemService();