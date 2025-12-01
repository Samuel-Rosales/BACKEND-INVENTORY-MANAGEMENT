import { StockGeneralDB, ProductDB } from "../models";
import { StockGeneralInterface } from "../interfaces";

class StockGeneralService {
    
    async getAll() {
        try {
            const stockGenerals = await StockGeneralDB.findAll({
                include: [
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Stock generals obtained correctly", 
                data: stockGenerals,   
            };
        } catch (error) {
            console.error("Error fetching stock generals: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(product_id: number, depot_id: number) {
        try {
            const stockGeneral = await StockGeneralDB.findOne({
                where: {
                    product_id,
                    depot_id
                },
                include: [
                    { model: ProductDB, as: "product" }
                ]
            });

            return {
                status: 200,
                message: "Stock general obtained correctly",
                data: stockGeneral,
            };
        } catch (error) {
            console.error("Error fetching stock general: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async stockGeneralsByProduct(product_id: number) {
        try {
            const stockGenerals = await StockGeneralDB.findAll({
                where: { product_id },
                include: [
                    { model: ProductDB, as: "product" },
                ],
            });
            
            return {
                status: 200,
                message: "Stock generals obtained correctly",
                data: stockGenerals,
            };
        } catch (error) {
            console.error("Error fetching stock generals by product: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async create(stockGeneral: StockGeneralInterface) {
        try {
            const { createdAt, updatedAt, ...stockGeneralData  } = stockGeneral;

            const newStockGeneral = await StockGeneralDB.create(stockGeneralData);

            return {
                status: 201,
                message: "Stock general created successfully",
                data: newStockGeneral,
            };
            } catch (error) { 
            console.error("Error creating stock general: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(product_id: number, depot_id: number, stockGeneral: Partial<StockGeneralInterface>) {
        try {
            const { createdAt, updatedAt, product_id: a, depot_id: b, ... stockGeneralData} = stockGeneral;

            await StockGeneralDB.update(stockGeneralData, { where: { product_id, depot_id } });

            const updatedStockGeneral = await StockGeneralDB.findOne({
                where: { product_id, depot_id }
            });

            return {
                status: 200,
                message: "Stock general update correctly",
                data: updatedStockGeneral,
            };
        } catch (error) {
            console.error("Error updating stock general: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (product_id: number, depot_id: number) {
        try {
            await StockGeneralDB.destroy({ where: {product_id, depot_id} });

            return { 
                status: 200,
                message: "Stock general deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting stock general: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await StockGeneralDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const StockGeneralServices = new StockGeneralService();