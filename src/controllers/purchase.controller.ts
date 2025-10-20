import type { Request, Response } from "express";
import { PurchaseServices } from "../services";

export class PurchaseController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await PurchaseServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await PurchaseServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await PurchaseServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await PurchaseServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await PurchaseServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}