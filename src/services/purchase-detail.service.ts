import { PurchaseDetailDB, PurchaseDB, ProductDB } from "../config";
import { PurchaseDetailInterface } from "../interfaces";

class PurchaseDetailService {
    async getAll() {
        try {
            const purchasesDetails = await PurchaseDetailDB.findAll({
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Purchases details obtained correctly", 
                data: purchasesDetails,   
            };
        } catch (error) {
            console.error("Error fetching purchases details: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(purchase_detail_id: number) {
        try {
            const purchaseDetail = await PurchaseDetailDB.findByPk(purchase_detail_id, {
                include: [
                    { model: PurchaseDB, as: "purchase" },
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Purchase detail obtained correctly",
                data: purchaseDetail,
            };
        } catch (error) {
            console.error("Error fetching purchase detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(purchaseDetail: PurchaseDetailInterface) {
        try {
            const { createdAt, updatedAt, ...purchaseDetailData  } = purchaseDetail;

            const newPurchaseDetail = await PurchaseDetailDB.create(purchaseDetailData);

            return {
                status: 201,
                message: "Purchase detail created successfully",
                data: newPurchaseDetail,
            };
            } catch (error) { 
            console.error("Error creating purchase detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(purchase_detail_id: number, purchaseDetail: Partial<PurchaseDetailInterface>) {
        try {
            const { createdAt, updatedAt, purchase_detail_id: _, ... purchaseDetailData} = purchaseDetail;

            await PurchaseDetailDB.update(purchaseDetailData, { where: { purchase_detail_id } });

            const updatedPurchaseDetail = await PurchaseDetailDB.findByPk(purchase_detail_id);

            return {
                status: 200,
                message: "Purchase detail update correctly",
                data: updatedPurchaseDetail,
            };
        } catch (error) {
            console.error("Error updating purchase detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (purchase_detail_id: number) {
        try {
            await PurchaseDetailDB.destroy({ where: {purchase_detail_id} });

            return { 
                status: 200,
                message: "Purchase detail deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting purchase detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await PurchaseDetailDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const PurchaseDetailServices = new PurchaseDetailService();