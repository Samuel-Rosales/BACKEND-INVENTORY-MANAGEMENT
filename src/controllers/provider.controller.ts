import type { Request, Response } from "express";
import { ProviderServices } from "../services";

export class ProviderController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await ProviderServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await ProviderServices.getOne(Number(id));
        
        return res.status(status).json({ 
            message,
            data,
        });
    };

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await ProviderServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await ProviderServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await ProviderServices.delete(Number(id));
        
        return res.status(status).json({
            message,
        });
    };
}