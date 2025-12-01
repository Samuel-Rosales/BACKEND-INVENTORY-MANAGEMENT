import type { Request, Response } from "express";
import { StockLotServices } from "../services";

export class StockLotController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await StockLotServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await StockLotServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    }; 

    stockLotsByProduct = async (req: Request, res: Response) => {
        const { product_id } = req.params;
        const { status, message, data } = await StockLotServices.stockLotsByProduct(Number(product_id));

        return res.status(status).json({
            message,
            data,
        });
    };

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await StockLotServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await StockLotServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await StockLotServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}