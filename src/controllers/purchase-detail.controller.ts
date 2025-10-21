import type { Request, Response } from "express";
import { PurchaseDetailServices } from "../services";

export class PurchaseDetailController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await PurchaseDetailServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await PurchaseDetailServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await PurchaseDetailServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await PurchaseDetailServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await PurchaseDetailServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}