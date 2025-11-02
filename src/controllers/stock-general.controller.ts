import type { Request, Response } from "express";
import { StockGeneralServices } from "../services";

export class StockGeneralController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await StockGeneralServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { product_id, depot_id } = req.params;
        const { status, message, data } = await StockGeneralServices.getOne(Number(product_id), Number(depot_id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await StockGeneralServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { product_id, depot_id } = req.params; 
        const { status, message, data } = await StockGeneralServices.update(Number(product_id), Number(depot_id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { product_id, depot_id } = req.params; 
        const { status, message } = await StockGeneralServices.delete(Number(product_id), Number(depot_id));
        
        return res.status(status).json({
            message,
        });
    };
}