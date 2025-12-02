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
            // A. Extraemos el filtro del Query Param
            const { filter } = req.query;

            // B. Validación: ¿El filtro es válido?
            // Esto evita que alguien envíe ?filter=hacker o ?filter=undefined
            const validFilters: ReportFilter[] = ['today', 'week', 'month', 'year'];
            
            // TypeScript ve req.query.filter como 'string | undefined', así que lo castigamos
            if (!filter || !validFilters.includes(filter as ReportFilter)) {
                return res.status(400).json({
                    status: 400,
                    message: `Filtro inválido. Opciones permitidas: ${validFilters.join(', ')}`,
                    data: null
                });
            }

            // C. Llamamos al servicio con el filtro validado
            // "as ReportFilter" le asegura a TS que es uno de los valores permitidos
            const chartData = await ReportServices.getSalesByDatesStats(filter as ReportFilter);

            // D. Respuesta exitosa
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

    getTopSellingProducts = async (req: Request, res: Response) => {
        try {
            const period = (req.query.period as string) || 'all';

            // 2. Llamamos al servicio
            const result = await ReportServices.getTopSellingProducts(period);

            // 3. Devolvemos la respuesta usando el status que nos dio el servicio
            return res.status(200).json({
                status: 200,
                message: "Report generated successfully",
                data: result.data
            });

        } catch (error) {
            console.error("Error en ReportController.getTopSellingProducts:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null
            });
        }
    };

    getInventoryEfficiency = async (req: Request, res: Response) => {
        try {
            const { status, message, data } = await ReportServices.getInventoryEfficiency();

            return res.status(status).json({
                message,
                data
            });

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
}