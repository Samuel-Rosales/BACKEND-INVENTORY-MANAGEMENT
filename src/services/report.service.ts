import { ReportFilter, SaleRecord, SalesChartData, SpotsChartData } from "@/interfaces";
import { ProductDB, PurchaseDB, SaleDB, SaleItemDB } from "../models";
import { Op, QueryTypes } from "sequelize";
import sequelize from "sequelize";
import { db } from "../config";

class ReportService {

    async getClientCorrelationFM(period: string = 'year') {
        try {
            const endDate = new Date();
            const startDate = new Date();

            // 1. Filtro de Fechas (Reutilizamos la lógica del empleado)
            switch (period) {
                case 'week': startDate.setDate(endDate.getDate() - 7); break;
                case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
                case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
                case 'all': default: startDate.setFullYear(2000); break; // Histórico
            }

            // 2. Consulta SQL: Agrupa Frecuencia (N° Órdenes) y Valor (Monto) por Cliente
            const sql = `
                SELECT
                    s.client_ci,
                    c.name as "client_name",
                    
                    -- EJE X: Frecuencia (Contar las ventas únicas)
                    CAST(COUNT(DISTINCT s.sale_id) AS INTEGER) as "orders_count",
                    
                    -- EJE Y: Valor Monetario (Suma de los totales)
                    COALESCE(CAST(SUM(s.total_usd) AS DECIMAL(10,2)), 0.00) as "total_spent"
                
                FROM sales s
                -- Asumimos una tabla 'clients' donde el CI del cliente es la llave primaria.
                -- Si tu tabla se llama diferente, ajusta 'clients'
                JOIN clients c ON s.client_ci = c.client_ci 
                
                WHERE s.sold_at BETWEEN :startDate AND :endDate
                  AND s.status = true
                  
                GROUP BY s.client_ci, c.name
                ORDER BY "total_spent" DESC;
            `;

            const results = await db.query(sql, { 
                type: QueryTypes.SELECT,
                replacements: { startDate, endDate }
            });

            // 3. Mapeo para el Frontend
            const mappedResults = results.map((item: any) => ({
                name: item.client_name,
                ordersCount: parseInt(item.orders_count),
                totalSpent: parseFloat(item.total_spent),
                // No necesitamos color en el backend; la UI lo asigna por cuadrante
            }));

            return {
                status: 200,
                message: "Client correlation (Frequency vs Value) retrieved successfully",
                data: mappedResults
            };

        } catch (error) {
            console.error("Error getting client correlation (FM):", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getEmployeePerformance(period: string = 'month') {
        try {
            const endDate = new Date();
            const startDate = new Date();

            // 1. Filtro de Fechas
            switch (period) {
                case 'week': startDate.setDate(endDate.getDate() - 7); break;
                case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
                case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
                default: startDate.setFullYear(2000); break;
            }

            // 2. Consulta SQL Corregida
            const sql = `
                SELECT 
                    u.name as "employee_name",
                    s.user_ci,

                    -- EJE X: Cantidad de Ventas Únicas
                    CAST(COUNT(DISTINCT s.sale_id) AS INTEGER) as "sales_count",

                    -- EJE Y: Ganancia Total Generada
                    COALESCE(CAST(
                        SUM(
                            (
                                si.unit_cost - -- Precio Venta (SaleItem)
                                
                                -- Costo Promedio de Compra
                                COALESCE(
                                    (SELECT AVG(unit_cost) FROM purchase_lot_items WHERE product_id = si.product_id),
                                    (SELECT AVG(unit_cost) FROM purchase_general_items WHERE product_id = si.product_id),
                                    0
                                )
                            ) * si.amount
                        )
                    AS DECIMAL(10,2)), 0.00) as "total_profit"

                FROM sales s
                JOIN sales_items si ON s.sale_id = si.sale_id
                
                -- CORRECCIÓN AQUÍ: Cambiamos u.ci por u.user_ci
                JOIN users u ON s.user_ci = u.user_ci 
                
                WHERE s.sold_at BETWEEN :startDate AND :endDate
                AND s.status = true
                AND si.status = true

                GROUP BY u.name, s.user_ci
                ORDER BY "total_profit" DESC;
            `;

            const results = await db.query(sql, { 
                type: QueryTypes.SELECT,
                replacements: { startDate, endDate }
            });

            // 3. Mapeo para el Frontend
            const mappedResults = results.map((item: any) => {
                const sales = parseInt(item.sales_count);
                const profit = parseFloat(item.total_profit);
                
                let colorHex = "#9CA3AF"; 

                // Lógica de colores (Semáforo de rendimiento)
                if (profit > 100 && sales > 5) {
                    colorHex = "#22C55E"; // Verde (Excelente)
                } else if (profit > 50) {
                    colorHex = "#3B82F6"; // Azul (Bueno)
                } else if (sales > 10) {
                    colorHex = "#F59E0B"; // Naranja (Mucho volumen, poco margen)
                } else {
                    colorHex = "#EF4444"; // Rojo (Bajo)
                }

                return {
                    name: item.employee_name,
                    sales_count: sales,
                    total_profit: profit,
                    color: colorHex
                };
            });

            return {
                status: 200,
                message: "Employee performance metrics retrieved successfully",
                data: mappedResults
            };

        } catch (error) {
            console.error("Error getting employee performance:", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getInventoryByCategory() {
        try {
            // Esta consulta es un poco compleja porque une varias tablas,
            // pero es la única forma precisa de obtener el VALOR monetario por categoría.
            const sql = `
                WITH CategoryValues AS (
                    SELECT 
                        c.name as category_name,
                        c.category_id,
                        
                        -- Suma valor en Stock General (Cantidad * Costo Promedio Histórico)
                        COALESCE(SUM(
                            (SELECT SUM(sg.amount) FROM stock_generals sg WHERE sg.product_id = p.product_id AND sg.status = true) * COALESCE((SELECT AVG(unit_cost) FROM purchase_general_items WHERE product_id = p.product_id), 0)
                        ), 0)
                        +
                        -- Suma valor en Stock Lotes (Cantidad * Costo Lote)
                        COALESCE(SUM(
                            (SELECT SUM(sl.amount * sl.cost_lot) FROM stock_lots sl WHERE sl.product_id = p.product_id AND sl.status = true)
                        ), 0) 
                        as total_value

                    FROM categories c
                    JOIN products p ON c.category_id = p.category_id
                    WHERE c.status = true AND p.status = true
                    GROUP BY c.category_id, c.name
                )
                SELECT 
                    category_name as "name",
                    CAST(total_value AS DECIMAL(10,2)) as "value",
                    
                    -- Calculamos el porcentaje sobre el total
                    CAST(
                        (total_value * 100.0) / (SELECT SUM(total_value) FROM CategoryValues WHERE total_value > 0)
                    AS DECIMAL(10,1)) as "percentage"
                    
                FROM CategoryValues
                WHERE total_value > 0 -- Solo mostrar categorías que tengan valor monetario
                ORDER BY total_value DESC;
            `;

            const results = await db.query(sql, { type: QueryTypes.SELECT });

            // Definimos una paleta de colores fija para que el frontend las asigne en orden
            // El frontend recibirá el HEX string.
            const colors = [
                "#6366F1", // Indigo (Electrónica/Alta)
                "#3B82F6", // Blue (Ropa/Media)
                "#10B981", // Emerald (Hogar/Baja)
                "#F59E0B", // Amber
                "#EC4899", // Pink
                "#8B5CF6", // Violet
                "#9CA3AF"  // Gray (Otros)
            ];

            const mappedData = results.map((item: any, index: number) => ({
                name: item.name,
                value: parseFloat(item.value), // Valor monetario total
                percentage: parseFloat(item.percentage), // Para el PieChart
                color: colors[index % colors.length] // Asigna color cíclicamente
            }));

            return {
                status: 200,
                message: "Inventory by category retrieved successfully",
                data: mappedData
            };

        } catch (error) {
            console.error("Error getting inventory by category:", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null
            };
        }
    }

    async getInventoryValue() {
        try {
            const sql = `
                SELECT 
                    (
                        -- PARTE A: Valor de Perecederos (LOTES)
                        -- Lógica: Cantidad Actual en Stock * Costo Real de ese Lote
                        -- Si vendes un producto, 'amount' en stock_lots baja, por lo tanto este valor baja.
                        COALESCE((
                            SELECT SUM(amount * cost_lot) 
                            FROM stock_lots 
                            WHERE status = true AND amount > 0
                        ), 0)
                        
                        +
                        
                        -- PARTE B: Valor de No Perecederos (GENERAL)
                        -- Lógica: Cantidad Actual en Stock * Costo Promedio de tus Compras
                        COALESCE((
                            SELECT SUM(
                                sg.amount * (
                                    -- Buscamos a cuánto has comprado este producto en el pasado (Promedio)
                                    COALESCE(
                                        (SELECT AVG(unit_cost) FROM purchase_general_items WHERE product_id = sg.product_id),
                                        0 -- Si fue un regalo o semilla sin compra, costo 0
                                    )
                                )
                            )
                            FROM stock_generals sg
                            WHERE sg.status = true AND sg.amount > 0
                        ), 0)
                        
                    ) as "total_value_usd";
            `;

            const result = await db.query(sql, { type: QueryTypes.SELECT });
            
            const totalValue = result[0] ? parseFloat((result[0] as any).total_value_usd) : 0.00;

            return {
                status: 200,
                message: "Inventory total value retrieved successfully",
                data: {
                    total_value_usd: totalValue,
                    currency: "USD"
                }
            };

        } catch (error) {
            console.error("Error getting inventory value:", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    // 2. SERVICIO: Conteo Total de Items Físicos
    async getTotalInventoryItems() {
        try {
            const sql = `
                SELECT 
                    (
                        -- Suma de Stocks Generales
                        COALESCE((SELECT SUM(amount) FROM stock_generals WHERE status = true), 0) 
                        +
                        -- Suma de Stocks por Lotes
                        COALESCE((SELECT SUM(amount) FROM stock_lots WHERE status = true), 0)
                    ) as "total_items";
            `;

            const result = await db.query(sql, { type: QueryTypes.SELECT });
            const totalItems = result[0] ? parseInt((result[0] as any).total_items) : 0;

            return {
                status: 200,
                message: "Total inventory items count retrieved",
                data: {
                    total_items: totalItems
                }
            };

        } catch (error) {
            console.error("Error getting total items:", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getLowStockAlerts() {
        try {
            const sql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.sku,
                    p.image_url,
                    p.min_stock,
                    
                    -- Cálculo del Stock Total (Suma Generales + Lotes)
                    (
                        COALESCE((SELECT SUM(amount) FROM stock_generals WHERE product_id = p.product_id AND status = true), 0) +
                        COALESCE((SELECT SUM(amount) FROM stock_lots WHERE product_id = p.product_id AND status = true), 0)
                    ) as "current_stock"

                FROM products p
                WHERE p.status = true
                
                -- FILTRO: Solo devolver donde el Stock Actual sea MENOR al Mínimo
                AND (
                    COALESCE((SELECT SUM(amount) FROM stock_generals WHERE product_id = p.product_id AND status = true), 0) +
                    COALESCE((SELECT SUM(amount) FROM stock_lots WHERE product_id = p.product_id AND status = true), 0)
                ) < p.min_stock
                
                ORDER BY "current_stock" ASC; -- Muestra primero los más críticos (stock 0)
            `;

            const results = await db.query(sql, { 
                type: QueryTypes.SELECT 
            });

            // Mapeo para formatear números y calcular el déficit
            const alerts = results.map((item: any) => {
                const currentStock = parseInt(item.current_stock);
                const minStock = item.min_stock;
                
                return {
                    product_id: item.product_id,
                    name: item.name,
                    sku: item.sku,
                    image_url: item.image_url,
                    min_stock: minStock,
                    current_stock: currentStock,
                    // Cuántos faltan para llegar al mínimo (Déficit)
                    missing_amount: minStock - currentStock,
                    // Nivel de urgencia visual
                    status: currentStock === 0 ? 'CRITICO' : 'BAJO'
                };
            });

            return {
                status: 200,
                message: "Low stock alerts retrieved successfully",
                data: alerts
            };

        } catch (error) {
            console.error("Error getting low stock alerts:", error);
            return {
                status: 500,
                message: "Internal server error retrieving stock alerts",
                data: null
            };
        }
    }

    async getInventoryEfficiency(period: string = 'month') {
        try {
            const endDate = new Date();
            const startDate = new Date();

            switch (period) {
                case 'week': startDate.setDate(endDate.getDate() - 7); break;
                case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
                case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
                default: startDate.setFullYear(2000); break;
            }

            const sql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.sku,
                    
                    COALESCE(CAST(SUM(si.amount) AS INTEGER), 0) as "quantity_sold",
                    
                    -- FÓRMULA DE GANANCIA CORREGIDA:
                    -- (Precio Venta Histórico) - (Costo Promedio de Adquisición)
                    COALESCE(CAST(
                        SUM( 
                            (
                                si.unit_cost -  -- Este es tu PRECIO DE VENTA (10.00)
                                
                                -- SUB-CONSULTA: Buscamos cuánto te costó comprarlo (Promedio)
                                COALESCE(
                                    (SELECT AVG(unit_cost) FROM purchase_lot_items WHERE product_id = p.product_id), -- Busca en lotes
                                    (SELECT AVG(unit_cost) FROM purchase_general_items WHERE product_id = p.product_id), -- O busca en generales
                                    0 -- Si nunca lo has comprado, asume costo 0
                                )
                            ) * si.amount 
                        ) 
                    AS DECIMAL(10,2)), 0.00) as "total_profit"

                FROM products p
                LEFT JOIN sales_items si ON p.product_id = si.product_id 
                    AND si."createdAt" BETWEEN :startDate AND :endDate
                    AND si.status = true 
                
                GROUP BY p.product_id, p.name, p.sku
                
                ORDER BY "total_profit" DESC, "quantity_sold" DESC;
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
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getTopSellingProducts(period: string = 'all') {
        try {
            // 1. LÓGICA DE FECHAS (Filtro dinámico)
            let dateFilter = {};
            const now = new Date();
            const startDate = new Date(now);

            switch (period) {
                case 'day':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    const day = startDate.getDay();
                    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Ajuste al lunes
                    startDate.setDate(diff);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'month':
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'year':
                    startDate.setMonth(0, 1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'all':
                default:
                    // 'all' no aplica filtro de fecha
                    break;
            }

            if (period !== 'all') {
                dateFilter = {
                    createdAt: {
                        [Op.between]: [startDate, now]
                    }
                };
            }

            // 2. CONSULTA A LA BASE DE DATOS (Top 5 más vendidos)
            const topProducts = await SaleItemDB.findAll({
                where: {
                    ...dateFilter,
                    status: true // Solo ventas activas
                },
                attributes: [
                    'product_id',
                    // Sumamos la cantidad vendida
                    [sequelize.fn('SUM', sequelize.col('SaleItem.amount')), 'total_sold']
                ],
                include: [
                    {
                        model: ProductDB,
                        as: 'product', // Asegúrate que tu alias en el modelo sea este
                        attributes: ['name', 'base_price', 'image_url', 'sku']
                    }
                ],
                group: [
                    'SaleItem.product_id', 
                    'product.product_id', 
                    'product.name', 
                    'product.base_price', 
                    'product.image_url', 
                    'product.sku'
                ],
                order: [[sequelize.literal('total_sold'), 'DESC']],
                limit: 10,
                raw: true,
                nest: true
            });

            // 3. CÁLCULO DE PORCENTAJE (Lógica para la UI)
            // Obtenemos el valor máximo (el del primer producto, ya que ordenamos DESC)
            let maxSold = 0;
            if (topProducts.length > 0) {
                maxSold = parseInt((topProducts[0] as any).total_sold);
            }

            // 4. MAPEO DE DATOS
            const formattedData = topProducts.map((item: any) => {
                const soldCount = parseInt(item.total_sold);
                
                // Calculamos porcentaje relativo al líder (0.0 a 1.0)
                // Si el líder vendió 100 y este 50, el porcentaje es 0.5
                let percentage = 0.0;
                if (maxSold > 0) {
                    percentage = parseFloat((soldCount / maxSold).toFixed(2));
                }

                return {
                    name: item.product.name, 
                    soldCount: soldCount,
                    percentage: percentage,  // <--- Esto llena la barrita en Flutter
                    
                    // Datos extra útiles
                    product_id: item.product_id,
                    sku: item.product.sku,
                    imageUrl: item.product.image_url
                };
            });

            return {
                status: 200,
                message: `Top selling products for period '${period}' retrieved successfully`,
                data: formattedData,
            };

        } catch (error) {
            console.error(`Error obtaining top products (${period}):`, error);
            return {
                status: 500,
                message: "Internal server error retrieving top products",
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