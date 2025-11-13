import type { Request, Response } from "express";
import { ClientServices } from "../services";

export class ClientController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await ClientServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const { status, message, data } = await ClientServices.getOne(id);
        
        return res.status(status).json({ 
            message,
            data,
        });
    };

    create = async (req: Request,  res: Response  ) => {
        const { status, message, data } = await ClientServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await ClientServices.update(id, req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    updateDeactivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await ClientServices.updateDeactivate(id);

        return res.status(status).json({
            message,
            data,
        });
    };

    updateActivate = async (req: Request, res: Response) => {
        const { id } = req.params; 
        const { status, message, data } = await ClientServices.updateActivate(id);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await ClientServices.delete(id);
        
        return res.status(status).json({
            message,
        });
    };
}