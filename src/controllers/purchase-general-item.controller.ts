import type { Request, Response } from "express";
import { PurchaseGeneralItemServices } from "../services";

export class PurchaseGeneralItemController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await PurchaseGeneralItemServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await PurchaseGeneralItemServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await PurchaseGeneralItemServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await PurchaseGeneralItemServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await PurchaseGeneralItemServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}