import { ReportFilter, SaleRecord, SalesChartData, SpotsChartData } from "@/interfaces";
import { ClientDB, ProductDB, ProviderDB, PurchaseDB, SaleDB, SaleItemDB, TypePaymentDB, UserDB } from "../models";
import { Op, QueryTypes } from "sequelize";
import sequelize from "sequelize";
import { db } from "../config";

class ReportService {

    async getSupplierAnalysis(period: string = 'month', customStart?: string, customEnd?: string) {
        try {
            // 1. Configuración de Fechas (Reutilizando tu lógica estándar)
            let endDate = new Date();
            let startDate = new Date();
            endDate.setHours(23, 59, 59, 999); // Final del día

            if (period === 'custom' && customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                endDate.setHours(23, 59, 59, 999);
            } else {
                // LÓGICA AUTOMÁTICA CORREGIDA
                switch (period) {
                    case 'today':
                        startDate.setHours(0, 0, 0, 0); // Desde las 00:00 de hoy
                        break;
                    
                    case 'week':
                        startDate.setDate(endDate.getDate() - 7); // Últimos 7 días
                        break;
                    
                    case 'month':
                        // CORRECCIÓN: Poner el día en 1 para que sea "Desde el principio de este mes"
                        startDate.setDate(1); 
                        startDate.setHours(0, 0, 0, 0);
                        break;
                        
                    case 'year':
                        // CORRECCIÓN: Poner mes 0 y día 1 para "Desde principio de este año"
                        startDate.setMonth(0); 
                        startDate.setDate(1);
                        startDate.setHours(0, 0, 0, 0);
                        break;
                        
                    case 'all': 
                        startDate = new Date('2000-01-01');
                        break;
                        
                    default:
                        // Default al mes actual
                        startDate.setDate(1); 
                        startDate.setHours(0, 0, 0, 0);
                        break;
                }
            }

            // 2. Consulta a Base de Datos
            // Agrupamos por proveedor y sumamos total_usd
            const purchases = await PurchaseDB.findAll({
                where: {
                    bought_at: { [Op.between]: [startDate, endDate] },
                    active: true // Solo compras activas (no borradas lógicamente)
                },
                attributes: [
                    'provider_id',
                    [db.fn('COUNT', db.col('purchase_id')), 'purchaseCount'],
                    [db.fn('SUM', db.col('total_usd')), 'totalSpent']
                ],
                include: [{
                    model: ProviderDB,
                    as: 'provider',
                    attributes: ['name']
                }],
                group: ['Purchase.provider_id', 'provider.provider_id', 'provider.name'], 
                order: [[db.literal('"totalSpent"'), 'DESC']] // Ordenar por quien más gasta
            });

            // 3. Manejo de caso vacío
            if (purchases.length === 0) {
                return {
                    status: 200,
                    message: "No data available for this period",
                    data: {
                        totalSpentGlobal: 0,
                        totalTransactions: 0,
                        totalSuppliers: 0,
                        topSupplierName: "N/A",
                        suppliersList: [],
                        spendingDistribution: []
                    }
                };
            }

            // 4. Procesamiento de Datos (Cálculo de Totales y Porcentajes)
            let globalSpent = 0;
            let globalTransactions = 0;

            // Mapeo inicial para limpiar la data de Sequelize
            const rawList = purchases.map((p: any) => {
                const spent = parseFloat(p.getDataValue('totalSpent'));
                const count = parseInt(p.getDataValue('purchaseCount'));
                const name = p.provider?.name || "Proveedor Desconocido";

                globalSpent += spent;
                globalTransactions += count;

                return { name, totalSpent: spent, purchaseCount: count };
            });

            // Crear lista detallada con porcentajes
            const suppliersList = rawList.map(item => ({
                ...item,
                percentage: globalSpent > 0 ? (item.totalSpent / globalSpent) * 100 : 0
            }));

            // 5. Preparar datos para el Gráfico de Pastel (Top 4 + Otros)
            const pieChartData = [];
            // Colores sugeridos para el frontend (puedes enviarlos o asignarlos allá)
            const colors = ["#5C6BC0", "#AB47BC", "#FF7043", "#78909C", "#26A69A"]; 

            // Tomamos los top 4
            for (let i = 0; i < Math.min(suppliersList.length, 4); i++) {
                pieChartData.push({
                    name: suppliersList[i].name,
                    value: suppliersList[i].percentage,
                    color: colors[i] || "#9E9E9E"
                });
            }

            // Agrupamos el resto en "Otros"
            if (suppliersList.length > 4) {
                let othersPercentage = 0;
                for (let i = 4; i < suppliersList.length; i++) {
                    othersPercentage += suppliersList[i].percentage;
                }
                pieChartData.push({
                    name: "Otros",
                    value: othersPercentage,
                    color: "#BDBDBD" // Gris
                });
            }

            // 6. Armar respuesta final
            const responseData = {
                totalSpentGlobal: globalSpent,
                totalTransactions: globalTransactions,
                totalSuppliers: suppliersList.length,
                topSupplierName: suppliersList.length > 0 ? suppliersList[0].name : "N/A",
                suppliersList: suppliersList,
                spendingDistribution: pieChartData
            };

            return {
                status: 200,
                message: "Supplier analysis retrieved successfully",
                data: responseData
            };

        } catch (error) {
            console.error("Error getting supplier analysis: ", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getProductCostHistory(productId: number, providerId?: number) {
        try {
            // Construimos la cláusula WHERE dinámicamente
            let providerFilter = "";
            
            // Si nos enviaron un proveedor, agregamos el filtro SQL
            if (providerId) {
                providerFilter = "AND p.provider_id = :providerId";
            }

            const sql = `
                SELECT 
                    TO_CHAR(p.bought_at, 'YYYY-MM-DD') as "date",
                    CAST(items.unit_cost AS DECIMAL(10,2)) as "cost",
                    prov.name as "provider_name",
                    prov.provider_id
                
                FROM purchases p
                JOIN providers prov ON p.provider_id = prov.provider_id
                
                JOIN (
                    SELECT purchase_id, product_id, unit_cost FROM purchase_general_items
                    UNION ALL
                    SELECT purchase_id, product_id, unit_cost FROM purchase_lot_items
                ) as items ON p.purchase_id = items.purchase_id
                
                WHERE items.product_id = :productId
                AND p.status = 'Aprobado'
                ${providerFilter} -- <--- Aquí se inyecta el filtro opcional
                
                ORDER BY p.bought_at ASC;
            `;

            const results = await db.query(sql, { 
                type: QueryTypes.SELECT,
                replacements: { 
                    productId,
                    providerId // Sequelize ignorará esto si no está en el SQL string, pero es seguro pasarlo
                }
            });

            const history = results.map((item: any) => ({
                date: item.date,
                cost: parseFloat(item.cost),
                provider: item.provider_name,
                provider_id: item.provider_id
            }));

            return {
                status: 200,
                message: "Product cost history retrieved successfully",
                data: history
            };

        } catch (error) {
            console.error("Error getting product cost history:", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getClientCorrelationFM(period: string = 'year', customStart?: string, customEnd?: string) {
        try {
            let endDate = new Date();
            let startDate = new Date();

            // 1. Filtro de Fechas
            if (period === 'custom' && customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                // Ajustamos al final del día
                endDate.setHours(23, 59, 59, 999);
            } else {
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
                    case 'all': 
                    default: 
                        startDate.setFullYear(2000); 
                        break; // Histórico
                }
            }

            // 2. Consulta SQL
            const sql = `
                SELECT
                    s.client_ci,
                    c.name as "client_name",
                    
                    -- EJE X: Frecuencia (Contar las ventas únicas)
                    CAST(COUNT(DISTINCT s.sale_id) AS INTEGER) as "orders_count",
                    
                    -- EJE Y: Valor Monetario (Suma de los totales)
                    COALESCE(CAST(SUM(s.total_usd) AS DECIMAL(10,2)), 0.00) as "total_spent"
                
                FROM sales s
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

    async getAllSalesByRangeData(period: string = 'month', customStart?: string, customEnd?: string) {
        try {
            // 1. Lógica de Fechas Unificada
            let endDate = new Date();
            let startDate = new Date();
            
            // Ajustamos endDate al final del día actual por defecto
            endDate.setHours(23, 59, 59, 999);

            if (period === 'custom' && customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                endDate.setHours(23, 59, 59, 999); // Asegurar cobertura del último día
            } else {
                // Seteamos startDate según el periodo
                switch (period) {
                    case 'today':
                        startDate.setHours(0, 0, 0, 0); // Inicio del día de hoy
                        break;
                    case 'week':
                        startDate.setDate(endDate.getDate() - 7);
                        break;
                    case 'month':
                        startDate.setMonth(endDate.getMonth() - 1);
                        break;
                    case 'year':
                        startDate.setFullYear(endDate.getFullYear() - 1);
                        break;
                    case 'all': 
                        startDate = new Date('2000-01-01'); // Fecha muy antigua
                        break;
                    default:
                        startDate.setMonth(endDate.getMonth() - 1); // Default mes
                        break;
                }
            }

            // 2. Query
            const whereClause: any = {};
            
            // Aplicamos filtro de fecha
            whereClause.sold_at = {
                [Op.between]: [startDate, endDate]
            };

            const sales = await SaleDB.findAll({
                where: whereClause,
                include: [
                    { model: ClientDB, as: "client", attributes: ['name'] },
                    { model: UserDB, as: "user", attributes: ['name'] },
                    { model: TypePaymentDB, as: "type_payment", attributes: ['name'] },
                ],
                order: [['sold_at', 'DESC']]
            });

            if (sales.length === 0) {
                return {
                    status: 404,
                    message: "No sales found in this range",
                    data: []
                };
            }

            const salesData = sales.map(sale => {
                const saleData = sale.toJSON();
                return {
                    ...saleData,
                    client: saleData.client?.name || "Cliente Genérico",
                    user: saleData.user?.name || "Desconocido",
                    type_payment: saleData.type_payment?.name || "No especificado",
                };
            });

            return { 
                status: 200,
                message: "Sales obtained correctly", 
                data: salesData,   
            };

        } catch (error) {
            console.error("Error fetching sales: ", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }

    async getAllPurchasesByRangeData(period: string = 'month', customStart?: string, customEnd?: string) {
        try {
            // 1. Lógica de Fechas Unificada
            let endDate = new Date();
            let startDate = new Date();
            endDate.setHours(23, 59, 59, 999);

            if (period === 'custom' && customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                endDate.setHours(23, 59, 59, 999);
            } else {
                switch (period) {
                    case 'today':
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case 'week':
                        startDate.setDate(endDate.getDate() - 7);
                        break;
                    case 'month':
                        startDate.setMonth(endDate.getMonth() - 1);
                        break;
                    case 'year':
                        startDate.setFullYear(endDate.getFullYear() - 1);
                        break;
                    case 'all': 
                        startDate = new Date('2000-01-01');
                        break;
                    default:
                        startDate.setMonth(endDate.getMonth() - 1);
                        break;
                }
            }

            // 2. Query
            const whereClause: any = {};

            // Usamos 'bought_at' como solicitaste
            whereClause.bought_at = {
                [Op.between]: [startDate, endDate]
            };

            const purchases = await PurchaseDB.findAll({
                where: whereClause,
                include: [
                    { model: ProviderDB, as: "provider", attributes: ['name'] },
                    { model: UserDB, as: "user", attributes: ['name'] },
                    { model: TypePaymentDB, as: "type_payment", attributes: ['name'] }
                ],
                order: [['bought_at', 'DESC']]
            });
    
            if (purchases.length === 0) {
                return {
                    status: 404,
                    message: "No purchases found in this range",
                    data: []
                };
            }
    
            const purchasesData = purchases.map(purchase => {
                const purchaseData = purchase.toJSON();
                return {
                    ...purchaseData,
                    provider: purchaseData.provider?.name || "Proveedor Genérico",
                    user: purchaseData.user?.name || "Desconocido",
                    type_payment: purchaseData.type_payment?.name || "No especificado",
                };
            });
    
            return { 
                status: 200,
                message: "Purchases obtained correctly", 
                data: purchasesData,   
            };

        } catch (error) {
            console.error("Error fetching purchases: ", error);
            return { status: 500, message: "Internal server error", data: null };
        }
    }
    // Start Employee
    async getEmployeePerformance(period: string = 'month', customStart?: string, customEnd?: string) {
        try {
            // Inicializamos fechas con el momento actual
            let endDate = new Date();
            let startDate = new Date();

            // 1. Lógica de Fechas
            if (period === 'custom' && customStart && customEnd) {
                // Si es personalizado, usamos los strings recibidos
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                
                // Aseguramos que la fecha fin cubra todo el día (hasta las 23:59:59)
                endDate.setHours(23, 59, 59, 999);
            } else {
                // Lógica predeterminada (automática)
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
                        // Si no coincide o es 'all', ponemos una fecha muy antigua
                        startDate.setFullYear(2000); 
                        break;
                }
            }

            // 2. Consulta SQL (Se mantiene igual, solo usa las variables startDate/endDate ya calculadas)
            const sql = `
                SELECT 
                    u.name as "employee_name",
                    s.user_ci,
                    CAST(COUNT(DISTINCT s.sale_id) AS INTEGER) as "sales_count",
                    COALESCE(CAST(
                        SUM(
                            (
                                si.unit_cost - 
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

                if (profit > 100 && sales > 5) {
                    colorHex = "#22C55E";
                } else if (profit > 50) {
                    colorHex = "#3B82F6";
                } else if (sales > 10) {
                    colorHex = "#F59E0B";
                } else {
                    colorHex = "#EF4444";
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
    // End Employee

    //Start Inventory 
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

    // -------------------------------------------------------------
    // 1. EFICIENCIA DE INVENTARIO (Profitability)
    // -------------------------------------------------------------
    async getInventoryEfficiency(period: string = 'month', customStart?: string, customEnd?: string) {
        try {
            let startDate = new Date();
            let endDate = new Date();

            // A. Lógica de Fechas
            if (period === 'custom' && customStart && customEnd) {
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
                // Aseguramos que cubra todo el día final
                endDate.setHours(23, 59, 59, 999); 
            } else {
                // Lógica Estándar (Relativa a "Hoy")
                switch (period) {
                    case 'week': startDate.setDate(endDate.getDate() - 7); break;
                    case 'month': startDate.setMonth(endDate.getMonth() - 1); break;
                    case 'year': startDate.setFullYear(endDate.getFullYear() - 1); break;
                    default: startDate.setFullYear(2000); break; // 'all' o default
                }
            }

            // B. Consulta SQL (Sin cambios, solo usa las fechas calculadas arriba)
            const sql = `
                SELECT 
                    p.product_id,
                    p.name,
                    p.sku,
                    COALESCE(CAST(SUM(si.amount) AS INTEGER), 0) as "quantity_sold",
                    COALESCE(CAST(
                        SUM( 
                            (
                                si.unit_cost - 
                                COALESCE(
                                    (SELECT AVG(unit_cost) FROM purchase_lot_items WHERE product_id = p.product_id),
                                    (SELECT AVG(unit_cost) FROM purchase_general_items WHERE product_id = p.product_id),
                                    0
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

    // -------------------------------------------------------------
    // 2. TOP PRODUCTOS VENDIDOS
    // -------------------------------------------------------------
    async getTopSellingProducts(period: string = 'all', customStart?: string, customEnd?: string) {
        try {
            // 1. LÓGICA DE FECHAS
            let dateFilter = {};
            const now = new Date();
            const startDate = new Date(now);

            if (period === 'custom' && customStart && customEnd) {
                const cStart = new Date(customStart);
                const cEnd = new Date(customEnd);
                cEnd.setHours(23, 59, 59, 999);

                dateFilter = {
                    createdAt: {
                        [Op.between]: [cStart, cEnd]
                    }
                };
            } else if (period !== 'all') {
                // Lógica Estándar
                switch (period) {
                    case 'day':
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case 'week':
                        const day = startDate.getDay();
                        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); 
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
                }

                dateFilter = {
                    createdAt: {
                        [Op.between]: [startDate, now]
                    }
                };
            }

            // 2. CONSULTA BD (Sequelize)
            const topProducts = await SaleItemDB.findAll({
                where: {
                    ...dateFilter,
                    status: true 
                },
                attributes: [
                    'product_id',
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

            // 3. CÁLCULOS UI
            let maxSold = 0;
            if (topProducts.length > 0) {
                maxSold = parseInt((topProducts[0] as any).total_sold);
            }

            const formattedData = topProducts.map((item: any) => {
                const soldCount = parseInt(item.total_sold);
                let percentage = 0.0;
                if (maxSold > 0) {
                    percentage = parseFloat((soldCount / maxSold).toFixed(2));
                }

                return {
                    name: item.product.name, 
                    soldCount: soldCount,
                    percentage: percentage,
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
    //End Inventory


    //Start resummary
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

    async getSalesByDatesStats(filter: string, customStart?: string, customEnd?: string): Promise<SalesChartData> {
        let start: Date, end: Date;

        // Lógica de fechas: Custom vs Estándar
        if (filter === 'custom' && customStart && customEnd) {
            start = new Date(customStart);
            end = new Date(customEnd);
            // Aseguramos que cubra hasta el final del último día
            end.setHours(23, 59, 59, 999);
        } else {
            // Si no es custom, usamos tu lógica existente (casting a ReportFilter para que no llore TS)
            const range = this.getDateRange(filter as ReportFilter);
            start = range.start;
            end = range.end;
        }

        const rawSales = await SaleDB.findAll({
            where: {
                sold_at: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            },
            attributes: ['sold_at']
        });

        const sales: SaleRecord[] = rawSales.map(sale => ({
            createdAt: new Date(sale.get('sold_at') as Date),
            amount: 0
        }));

        // Pasamos start y end al procesador porque 'custom' los necesita para generar los labels
        return this.processSalesIntoBuckets(sales, filter, start, end);
    }

    private processSalesIntoBuckets(sales: SaleRecord[], filter: string, start: Date, end: Date): SalesChartData {
        let labels: string[] = [];
        let label_shorts: string[] = [];
        let values: number[] = [];
        let index: number[] = [];
        
        // Variable auxiliar para 'custom'
        let customDaysMap: Date[] = [];

        // ---------------------------------------------------------
        // PASO 1: Preparar las cubetas (Labels e Índices)
        // ---------------------------------------------------------

        if (filter === 'custom') {
            // LÓGICA NUEVA: Generamos arrays dinámicos basados en la diferencia de días
            customDaysMap = this.getDaysArray(start, end);
            const daysCount = customDaysMap.length;

            values = new Array(daysCount).fill(0);
            index = Array.from({ length: daysCount }, (_, i) => i);
            
            // Labels: "10/12", "11/12"
            labels = customDaysMap.map(d => `${d.getDate()}/${d.getMonth() + 1}`);
            label_shorts = labels; // En custom usamos el mismo label corto

        } else {
            // TU LÓGICA ORIGINAL (Mantenida intacta)
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
                    // Nota: Usamos la fecha actual para calcular días del mes si es 'month' genérico
                    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                    values = new Array(daysInMonth).fill(0);
                    index = Array.from({ length: daysInMonth }, (_, i) => i);
                    labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
                    label_shorts = labels; 
                    break;
                case 'year':
                    values = new Array(12).fill(0);
                    index = Array.from({ length: 12 }, (_, i) => i);
                    labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    label_shorts = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                    break;
            }
        }

        // ---------------------------------------------------------
        // PASO 2: Llenar las cubetas
        // ---------------------------------------------------------
        sales.forEach(sale => {
            let idx = -1;

            if (filter === 'custom') {
                // LÓGICA NUEVA PARA CUSTOM
                // Convertimos a string YYYY-MM-DD para comparar solo fecha (sin hora)
                const saleDateStr = sale.createdAt.toISOString().split('T')[0];
                
                // Buscamos en qué posición del array de días cae esta venta
                idx = customDaysMap.findIndex(d => d.toISOString().split('T')[0] === saleDateStr);

            } else if (filter === 'today') {
                idx = sale.createdAt.getHours();
            } else if (filter === 'week') {
                idx = sale.createdAt.getDay() - 1;
                if (idx === -1) idx = 6; // Domingo
            } else if (filter === 'month') {
                idx = sale.createdAt.getDate() - 1;
            } else if (filter === 'year') {
                idx = sale.createdAt.getMonth();
            }

            // Si encontramos el índice válido, sumamos
            if (idx >= 0 && idx < values.length) {
                values[idx] += 1;
            }
        });

        // ---------------------------------------------------------
        // PASO 3: Retorno (Con Casting para TypeScript)
        // ---------------------------------------------------------
        const total = values.reduce((acc, curr) => acc + curr, 0);

        const spots: SpotsChartData[] = index.map((idx, i) => ({
            index: idx,
            value: values[i]
        }));

        return { 
            filter: filter as ReportFilter, // <--- ESTO ARREGLA EL ERROR DE TIPO ROJO
            labels, 
            label_shorts, // <--- Mantenemos esto opcional/necesario
            spots, 
            total 
        };
    }

    private getDaysArray(start: Date, end: Date) {
        const arr = [];
        for(let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    }

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
    //End resummary
}

export const ReportServices = new ReportService();