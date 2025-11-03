import type { Request, Response } from "express";
import { SaleItemServices } from "../services";

export class SaleItemController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await SaleItemServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await SaleItemServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await SaleItemServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await SaleItemServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await SaleItemServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}