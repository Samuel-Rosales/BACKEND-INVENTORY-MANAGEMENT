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
}