import { SaleDB } from "../models";

class ReportService {
    
    async totalUsdSales() {
        try {
            const  sales = await SaleDB.findAll();
            const totalUSD: number = sales.reduce((sum, sale) => {
                
                const saleAmountString = sale.get('total_usd') as string;

                const numericAmount = parseFloat(saleAmountString);
                
                return sum + numericAmount;
            }, 0);


            return {
                status: 200,
                message: "USD total sales calculated successfully",
                data: totalUSD,
            };
        } catch (error) {
            console.error("Error calculating USD total sales: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}

export const ReportServices = new ReportService();