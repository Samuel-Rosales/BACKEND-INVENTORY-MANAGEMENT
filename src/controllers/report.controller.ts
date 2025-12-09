import { ReportFilter } from "../interfaces";
import { ReportServices } from "../services";
import type { Request, Response } from "express";

export class ReportController {
    constructor() {}

    totalUsdSales = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.totalUsdSales();

        return res.status(status).json({
            message,
            data,
        });
    };

    totalUsdPurchases = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.totalUsdPurchase();

        return res.status(status).json({
            message,
            data,
        });
    };

    getSalesChart = async (req: Request, res: Response) => {
        try {
            console.log("📥 QUERY RECIBIDO:", req.query); 
            console.log("🔍 Tipos:", { 
                filter: typeof req.query.filter, 
                start: typeof req.query.customStart 
            });
            // ---------------------------------

            const { filter, customStart, customEnd } = req.query;

            // B. Validación: Agregamos 'custom' a la lista permitida
            const validFilters = ['today', 'week', 'month', 'year', 'custom'];
            
            // TypeScript ve req.query como tipos complejos, aseguramos que sea string
            const filterStr = filter as string;

            if (!filter || !validFilters.includes(filterStr)) {
                return res.status(400).json({
                    status: 400,
                    message: `Filtro inválido. Opciones permitidas: ${validFilters.join(', ')}`,
                    data: null
                });
            }

            // C. VALIDACIÓN EXTRA: Si es 'custom', las fechas son obligatorias
            if (filterStr === 'custom') {
                if (!customStart || !customEnd) {
                    return res.status(400).json({
                        status: 400,
                        message: "Para el filtro personalizado, se requieren 'customStart' y 'customEnd'.",
                        data: null
                    });
                }
            }

            // D. Llamamos al servicio pasando los 3 parámetros
            // El servicio ya sabe que si no es 'custom', las fechas pueden ser undefined
            const chartData = await ReportServices.getSalesByDatesStats(
                filterStr, 
                customStart as string, 
                customEnd as string
            );

            // E. Respuesta exitosa
            return res.status(200).json({
                status: 200,
                message: "Report generated successfully",
                data: chartData
            });

        } catch (error) {
            console.error("Error in getSalesChart controller:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error generating chart",
                data: null
            });
        }
    }

    // -------------------------------------------------------------
    // CONTROLLER: TOP SELLING
    // -------------------------------------------------------------
    getTopSellingProducts = async (req: Request, res: Response) => {
        try {
            // Extraemos todo del query
            const { period, customStart, customEnd } = req.query;
            
            // Valor por defecto si no viene nada
            const periodStr = (period as string) || 'all';

            // Validación opcional para Custom
            if (periodStr === 'custom' && (!customStart || !customEnd)) {
                return res.status(400).json({
                    message: "Para el periodo personalizado, se requieren 'customStart' y 'customEnd'.",
                    data: null
                });
            }
            
            const { status, message, data } = await ReportServices.getTopSellingProducts(
                periodStr, 
                customStart as string, 
                customEnd as string
            );

            return res.status(status).json({ message, data });
        } catch (error) {
            console.error("Error controller TopSelling:", error);
            return res.status(500).json({ message: "Internal Error", data: null });
        }
    };

    // -------------------------------------------------------------
    // CONTROLLER: INVENTORY EFFICIENCY
    // -------------------------------------------------------------
    getInventoryEfficiency = async (req: Request, res: Response) => {
        try {
            // Extraemos todo del query
            const { period, customStart, customEnd } = req.query;

            // Valor por defecto 'month' (o el que prefieras)
            const periodStr = (period as string) || 'month';

            // Validación opcional para Custom
            if (periodStr === 'custom' && (!customStart || !customEnd)) {
                return res.status(400).json({
                    message: "Para el periodo personalizado, se requieren 'customStart' y 'customEnd'.",
                    data: null
                });
            }

            const { status, message, data } = await ReportServices.getInventoryEfficiency(
                periodStr,
                customStart as string,
                customEnd as string
            );

            return res.status(status).json({ message, data });

        } catch (error) {
            console.error("Error en ReportController.getInventoryEfficiency:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null
            });
        }
    };

    getLowStockAlerts = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.getLowStockAlerts();

        return res.status(status).json({
            message,
            data
        });
    };

    getInventoryValue = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.getInventoryValue();
        
        return res.status(status).json({
            message,
            data
        });
    };

    getTotalInventoryItems = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.getTotalInventoryItems();
        return res.status(status).json({
            message,
            data
        });
    };

    getInventoryByCategory = async (req: Request, res: Response) => {
        const { status, message, data } = await ReportServices.getInventoryByCategory();
        return res.status(status).json({
            message,
            data
        });
    };




    getEmployeePerformance = async (req: Request, res: Response) => {
        // Obtenemos parámetros. Si no llegan, serán undefined.
        const period = req.query.period as string || 'month';
        const startDate = req.query.startDate as string | undefined;
        const endDate = req.query.endDate as string | undefined;
        
        // Pasamos los 3 argumentos al servicio
        const { status, message, data } = await ReportServices.getEmployeePerformance(period, startDate, endDate);

        return res.status(status).json({ 
            message, 
            data 
        });
    };

    getClientCorrelationFM = async (req: Request, res: Response) => {
        // Leemos el query param ?period=year (por defecto)
        const period = req.query.period as string || 'year';
        const { status, message, data } = await ReportServices.getClientCorrelationFM(period);
        return res.status(status).json({ 
            message, 
            data 
        });
    };

    getProductCostHistory = async (req: Request, res: Response) => {
        const { product_id } = req.params; // ID del producto (Obligatorio)
        const { provider_id } = req.query; // ID del proveedor (Opcional)

        if (!product_id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Convertimos a número o dejamos undefined si no lo enviaron
        const providerIdNumber = provider_id ? Number(provider_id) : undefined;

        const result = await ReportServices.getProductCostHistory(Number(product_id), providerIdNumber);
        return res.status(result.status).json({ 
            message: result.message, 
            data: result.data 
        });
    };
}