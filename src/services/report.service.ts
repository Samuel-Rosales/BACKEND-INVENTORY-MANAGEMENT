import { ReportFilter, SaleRecord, SalesChartData, SpotsChartData } from "@/interfaces";
import { ProductDB, PurchaseDB, SaleDB, SaleItemDB } from "../models";
import { Op, QueryTypes } from "sequelize";
import sequelize from "sequelize";
import { db } from "../config";
import { stat } from "fs";

class ReportService {

    async getInventoryEfficiency(period: string = 'month') {
    try {
        // ... lógica de fechas (igual que antes) ...
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default: 
                startDate.setFullYear(2000); 
                break;
        }

        const sql = `
            SELECT 
                p.product_id,
                p.name,
                p.sku,
                
                -- Cantidad Total Vendida
                CAST(SUM(si.amount) AS INTEGER) as "quantity_sold",
                
                -- Ganancia Total
                CAST(
                    SUM( 
                        (p.base_price - si.unit_cost) * si.amount 
                    ) 
                AS DECIMAL(10,2)) as "total_profit"

            FROM sales_items si
            JOIN products p ON si.product_id = p.product_id
            
            -- FIX: Usamos comillas dobles para respetar el camelCase de Sequelize
            WHERE si."createdAt" BETWEEN :startDate AND :endDate
            AND si.status = true 
            
            GROUP BY p.product_id, p.name, p.sku, p.base_price
            
            HAVING SUM(si.amount) > 0
            
            ORDER BY "total_profit" DESC;
        `;

        const results = await db.query(sql, { 
            type: QueryTypes.SELECT,
            replacements: { startDate, endDate }
        });

        const mappedResults = results.map((item: any) => ({
            product_id: item.product_id,
            name: item.name,
            sku: item.sku,
            quantity_sold: parseInt(item.quantity_sold),
            total_profit: parseFloat(item.total_profit)
        }));

        return { 
            status: 200, 
            message: "Inventory efficiency data retrieved successfully", 
            data: mappedResults  
        };

    } catch (error) {
        console.error("Error efficiency matrix:", error);
        return {
            status: 500,
            message: "Internal server error retrieving inventory efficiency data",
            data: null
        };
    }
}

    async getTopSellingProducts(period: string = 'all') {
        try {
            // 1. LÓGICA DE FILTRADO DE FECHAS
            let dateFilter = {};
            const now = new Date();
            // Clonamos la fecha actual para manipularla sin afectar 'now'
            const startDate = new Date(now); 

            // Configuramos el inicio del día/semana/mes/año
            switch (period) {
                case 'day':
                    // Inicio de hoy (00:00:00)
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    // Inicio de la semana (Domingo como día 0, o Lunes según prefieras)
                    // Restamos los días transcurridos desde el inicio de la semana
                    const dayOfWeek = startDate.getDay(); // 0 (Domingo) - 6 (Sábado)
                    const diff = startDate.getDate() - dayOfWeek; 
                    startDate.setDate(diff);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'month':
                    // Día 1 del mes actual
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'year':
                    // Día 1 de Enero del año actual
                    startDate.setMonth(0, 1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'all':
                default:
                    // Si es 'all' o no se reconoce, no filtramos (dejamos startDate null)
                    break;
            }

            // Si se seleccionó un periodo específico, aplicamos el filtro WHERE
            if (period !== 'all') {
                dateFilter = {
                    createdAt: {
                        [Op.between]: [startDate, now] // Desde el inicio calculado hasta AHORA mismo
                    }
                };
            }

            // 2. CONSULTA A LA BASE DE DATOS
            const topProducts = await SaleItemDB.findAll({
                // APLICAMOS EL FILTRO AQUÍ
                where: dateFilter, 
                
                attributes: [
                    'product_id',
                    // Sumamos 'amount' como 'total_sold'
                    [sequelize.fn('SUM', sequelize.col('SaleItem.amount')), 'total_sold']
                ],
                include: [
                    {
                        model: ProductDB,
                        as: 'product',
                        attributes: ['name', 'base_price', 'image_url', 'sku']
                    }
                ],
                group: [
                    // Agrupación obligatoria para Postgres
                    'SaleItem.product_id', 
                    'product.product_id', 
                    'product.name', 
                    'product.base_price', 
                    'product.image_url', 
                    'product.sku'
                ],
                // Ordenamos por la columna calculada
                order: [[sequelize.literal('total_sold'), 'DESC']],
                limit: 5,
                raw: true,
                nest: true
            });

            // 3. MAPEO DE DATOS (CamelCase para el Frontend)
            const formattedData = topProducts.map((item: any) => ({
                product_id: item.product_id,
                total_sold: parseInt(item.total_sold),
                product: {
                    name: item.product.name,
                    price: parseFloat(item.product.base_price),
                    imageUrl: item.product.image_url,
                    sku: item.product.sku
                }
            }));

            return {
                status: 200,
                message: `Top selling products for period '${period}' retrieved successfully`,
                data: formattedData,
            };

        } catch (error) {
            console.error(`Error obteniendo top productos (${period}):`, error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }

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
        let label_shorts: string[] = [];
        let values: number[] = [];
        let index: number[] = [];

        // 1. Preparamos las cubetas vacías
        switch (filter) {
            case 'today':
                values = new Array(24).fill(0);
                index = Array.from({ length: 24 }, (_, i) => i);
                labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
                label_shorts = labels.map(label => label.split(':')[0]);

                break;
            case 'week':
                values = new Array(7).fill(0);
                index = Array.from({ length: 7 }, (_, i) => i);
                labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                label_shorts = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
                
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
                label_shorts = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
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

        return { filter, labels, label_shorts, spots, total };
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