import { SaleDetailDB, SaleDB, ProductDB } from "../config";
import { SaleDetailInterface } from "../interfaces";

class SaleDetailService {
    async getAll() {
        try {
            const SalesDetails = await SaleDetailDB.findAll({
                include: [
                    { model: SaleDB, as: "sale" },
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Sales details obtained correctly", 
                data: SalesDetails,   
            };
        } catch (error) {
            console.error("Error fetching sales details: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(sale_detail_id: number) {
        try {
            const saleDetail = await SaleDetailDB.findByPk(sale_detail_id, {
                include: [
                    { model: SaleDB, as: "sale" },
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Sale detail obtained correctly",
                data: saleDetail,
            };
        } catch (error) {
            console.error("Error fetching sale detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(saleDetail: SaleDetailInterface) {
        try {
            const { createdAt, updatedAt, status, ...saleDetailData } = saleDetail;

            const newSaleDetail = await SaleDetailDB.create(saleDetailData);

            return {
                status: 201,
                message: "Sale detail created successfully",
                data: newSaleDetail,
            };
            } catch (error) { 
            console.error("Error creating sale detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(sale_detail_id: number, saleDetail: Partial<SaleDetailInterface>) {
        try {
            const { createdAt, updatedAt, sale_detail_id: _, ... saleDetailData} = saleDetail;

            await SaleDetailDB.update(saleDetailData, { where: { sale_detail_id } });

            const updatedSaleDetail = await SaleDetailDB.findByPk(sale_detail_id);

            return {
                status: 200,
                message: "Sale detail update correctly",
                data: updatedSaleDetail,
            };
        } catch (error) {
            console.error("Error updating sale detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (sale_detail_id: number) {
        try {
            await SaleDetailDB.destroy({ where: {sale_detail_id} });

            return { 
                status: 200,
                message: "Sale detail deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting sale detail: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await SaleDetailDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const SaleDetailServices = new SaleDetailService();