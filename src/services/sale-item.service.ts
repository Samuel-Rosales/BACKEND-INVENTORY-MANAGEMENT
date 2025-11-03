import { SaleItemDB, SaleDB, ProductDB } from "../models";
import { SaleItemInterface } from "../interfaces";

class SaleItemService {
    async getAll() {
        try {
            const SalesDetails = await SaleItemDB.findAll({
                include: [
                    { model: SaleDB, as: "sale" },
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Sales items obtained correctly", 
                data: SalesDetails,   
            };
        } catch (error) {
            console.error("Error fetching sales items: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(sale_item_id: number) {
        try {
            const saleDetail = await SaleItemDB.findByPk(sale_item_id, {
                include: [
                    { model: SaleDB, as: "sale" },
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Sale item obtained correctly",
                data: saleDetail,
            };
        } catch (error) {
            console.error("Error fetching sale item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(saleDetail: SaleItemInterface) {
        try {
            const { createdAt, updatedAt, status, ...saleDetailData } = saleDetail;

            const newSaleDetail = await SaleItemDB.create(saleDetailData);

            return {
                status: 201,
                message: "Sale item created successfully",
                data: newSaleDetail,
            };
            } catch (error) { 
            console.error("Error creating sale item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(sale_item_id: number, saleDetail: Partial<SaleItemInterface>) {
        try {
            const { createdAt, updatedAt, sale_item_id: _, ... saleDetailData} = saleDetail;

            await SaleItemDB.update(saleDetailData, { where: { sale_item_id } });

            const updatedSaleDetail = await SaleItemDB.findByPk(sale_item_id);

            return {
                status: 200,
                message: "Sale item update correctly",
                data: updatedSaleDetail,
            };
        } catch (error) {
            console.error("Error updating sale item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (sale_item_id: number) {
        try {
            await SaleItemDB.destroy({ where: {sale_item_id} });

            return { 
                status: 200,
                message: "Sale item deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting sale item: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await SaleItemDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const SaleItemServices = new SaleItemService();