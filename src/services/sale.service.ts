import { SaleDB, ClientDB, TypePaymentDB, UserDB } from "../config";
import { SaleInterface } from "../interfaces";

class SaleService {
    async getAll() {
        try {
            const sales = await SaleDB.findAll({
                include: [
                    { model: ClientDB, as: "client" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                ],
            });

            return { 
                status: 200,
                message: "Sales obtained correctly", 
                data: sales,   
            };
        } catch (error) {
            console.error("Error fetching sales: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getOne(sale_id: number) {
        try {
            const sale = await SaleDB.findByPk(sale_id, {
                include: [
                    { model: ClientDB, as: "client" },
                    { model: UserDB, as: "user" },
                    { model: TypePaymentDB, as: "type_payment" },
                ]
            });

            return {
                status: 200,
                message: "Sale obtained correctly",
                data: sale,
            };
        } catch (error) {
            console.error("Error fetching Sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null, 
            };
        }
    }

    async create(sale: SaleInterface) {
        try {
            const { createdAt, updatedAt, ...saleData  } = sale;

            const newSale = await SaleDB.create(saleData);

            return {
                status: 201,
                message: "Sale created successfully",
                data: newSale,
            };
            } catch (error) { 
            console.error("Error creating sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async update(sale_id: number, sale: Partial<SaleInterface>) {
        try {
            const { createdAt, updatedAt, ... saleData} = sale;

            await SaleDB.update(saleData, { where: { sale_id } });

            const updatedSale = await SaleDB.findByPk(sale_id);

            return {
                status: 200,
                message: "Sale update correctly",
                data: updatedSale,
            };
        } catch (error) {
            console.error("Error updating sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async delete (sale_id: number) {
        try {
            await SaleDB.destroy({ where: {sale_id} });

            return { 
                status: 200,
                message: "Sale deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting sale: ", error);

            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    /*const purchases = await SaleDB.findAll({
  where: {
        purchase_date: {
        [Op.between]: ['2025-06-01', '2025-06-30']
        }
    },
    include: [...]
    });*/
}

export const SaleServices = new SaleService();