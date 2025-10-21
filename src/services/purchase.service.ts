import { PurchaseDB, ProviderDB, TypePaymentDB, UserDB, PurchaseDetailDB } from "../models";
import { PurchaseInterface } from "../interfaces";

class PurchaseService {
    async getAll() {
        try {
            const purchases = await PurchaseDB.findAll({
                include: [
                    { model: ProviderDB, as: "provider" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                    { model: PurchaseDetailDB, as: "purchase_details" },
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
        try {
            const { createdAt, updatedAt, purchase_id, ...purchaseData  } = purchase;

            const newPurchase = await PurchaseDB.create(purchaseData);

            return {
                status: 201,
                message: "Purchase created successfully",
                data: newPurchase,
            };
            } catch (error) { 
            console.error("Error creating purchase: ", error);

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