import { ReportFilter, SaleRecord, SalesChartData, SpotsChartData } from "@/interfaces";
import { PurchaseDB, SaleDB } from "../models";
import { Op } from "sequelize";

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

    async totalUsdPurchase() {
        try {
            const  purchases = await PurchaseDB.findAll();
            const totalUSD: number = purchases.reduce((sum, purchase) => {
                
                const purchaseAmountString = purchase.get('total_usd') as string;

                const numericAmount = parseFloat(purchaseAmountString);
                
                return sum + numericAmount;
            }, 0);


            return {
                status: 200,
                message: "USD total purchases calculated successfully",
                data: totalUSD,
            };
        } catch (error) {
            console.error("Error calculating USD total purchases: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

    async getSalesByDatesStats(filter: ReportFilter): Promise<SalesChartData> {
        const { start, end } = this.getDateRange(filter);

        const rawSales = await SaleDB.findAll({
            where: {
                createdAt: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            },
            // OPTIMIZACIÓN: Solo traemos la fecha, no necesitamos el dinero ni el cliente
            attributes: ['createdAt'] 
        });

        // Mapeamos solo la fecha, el amount ya no es relevante para contar cantidad
        const sales: SaleRecord[] = rawSales.map(sale => ({
            createdAt: new Date(sale.get('createdAt') as Date),
            amount: 0 // Lo dejamos en 0 porque no lo usaremos para este gráfico
        }));

        return this.processSalesIntoBuckets(sales, filter);
    }

    private processSalesIntoBuckets(sales: SaleRecord[], filter: ReportFilter) {
        let labels: string[] = [];
        let values: number[] = [];
        let index: number[] = [];

        // 1. Preparamos las cubetas vacías
        switch (filter) {
            case 'today':
                values = new Array(24).fill(0);
                index = Array.from({ length: 24 }, (_, i) => i);
                labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
                break;
            case 'week':
                values = new Array(7).fill(0);
                index = Array.from({ length: 7 }, (_, i) => i);
                labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                break;
            case 'month':
                const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                values = new Array(daysInMonth).fill(0);
                index = Array.from({ length: daysInMonth }, (_, i) => i);
                labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
                break;
            case 'year':
                values = new Array(12).fill(0);
                index = Array.from({ length: 12 }, (_, i) => i);
                labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                break;
        }

        // 2. Llenamos las cubetas (AQUÍ ESTÁ EL CAMBIO)
        sales.forEach(sale => {
            let index = -1;

            if (filter === 'today') {
                index = sale.createdAt.getHours();
            } else if (filter === 'week') {
                index = sale.createdAt.getDay() - 1;
                if (index === -1) index = 6; // Domingo
            } else if (filter === 'month') {
                index = sale.createdAt.getDate() - 1;
            } else if (filter === 'year') {
                index = sale.createdAt.getMonth();
            }

            // Si el índice es válido, SUMAMOS 1 (una venta más)
            if (index >= 0 && index < values.length) {
                values[index] += 1; // <--- CAMBIO CLAVE: Antes era += sale.amount
            }
        });

        // Total de transacciones
        const total = values.reduce((acc, curr) => acc + curr, 0);

        const spots: SpotsChartData[] = index.map((idx, i) => ({
            index: idx,
            value: values[i]
        }));

        return { filter, labels, spots, total };
    }

    // ... (tu método getDateRange sigue igual) ...
    private getDateRange(filter: ReportFilter): { start: Date, end: Date } {
         // ... (código anterior) ...
         // Solo lo copio resumido para contexto
         const now = new Date();
         const start = new Date();
         const end = new Date();
         start.setHours(0, 0, 0, 0);
         end.setHours(23, 59, 59, 999);
 
         switch (filter) {
             case 'week':
                 const day = start.getDay() || 7;
                 if (day !== 1) start.setDate(start.getDate() - (day - 1));
                 break;
             case 'month':
                 start.setDate(1);
                 break;
             case 'year':
                 start.setMonth(0, 1);
                 break;
         }
         return { start, end };
    }
}

export const ReportServices = new ReportService();