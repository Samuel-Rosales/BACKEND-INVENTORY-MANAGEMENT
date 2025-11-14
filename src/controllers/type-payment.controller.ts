import type { Request, Response } from "express";
import { TypePaymentServices } from "../services";

export class TypePaymentController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await TypePaymentServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await TypePaymentServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };  

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await TypePaymentServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await TypePaymentServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };
    
    updateDeactivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await TypePaymentServices.updateDeactivate(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    updateActivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await TypePaymentServices.updateActivate(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await TypePaymentServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}