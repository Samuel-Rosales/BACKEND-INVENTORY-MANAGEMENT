import { StockLotDB, PurchaseDB, ProductDB } from "../models";
import { StockLotInterface } from "../interfaces";

class StockLotService {
    async getAll() {
        try {
            const stockLots = await StockLotDB.findAll({
                include: [
                    { model: ProductDB, as: "product" },
                ],
            });

            return { 
                status: 200,
                message: "Stock lots obtained correctly", 
                data: stockLots,   
            };
        } catch (error) {
            console.error("Error fetching stock lots: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(stock_lot_id: number) {
        try {
            const stockLot = await StockLotDB.findByPk(stock_lot_id, {
                include: [
                    { model: ProductDB, as: "product" },
                ]
            });

            return {
                status: 200,
                message: "Stock lot obtained correctly",
                data: stockLot,
            };
        } catch (error) {
            console.error("Error fetching stock lot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(stockLot: StockLotInterface) {
        try {
            const { createdAt, updatedAt, ...stockLotData  } = stockLot;

            const newStockLot = await StockLotDB.create(stockLotData);

            return {
                status: 201,
                message: "Stock lot created successfully",
                data: newStockLot,
            };
            } catch (error) { 
            console.error("Error creating stock lot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(stock_lot_id: number, stockLot: Partial<StockLotInterface>) {
        try {
            const { createdAt, updatedAt, stock_lot_id: _, ... stockLotData} = stockLot;

            await StockLotDB.update(stockLotData, { where: { stock_lot_id } });

            const updatedStockLot = await StockLotDB.findByPk(stock_lot_id);

            return {
                status: 200,
                message: "Stock lot update correctly",
                data: updatedStockLot,
            };
        } catch (error) {
            console.error("Error updating stock lot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (stock_lot_id: number) {
        try {
            await StockLotDB.destroy({ where: {stock_lot_id} });

            return { 
                status: 200,
                message: "Stock lot deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting stock lot: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await StockLotDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/


}

export const StockLotServices = new StockLotService();