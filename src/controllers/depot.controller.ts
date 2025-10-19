import type { Request, Response } from "express";
import { DepotServices } from "../services";

export class DepotController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await DepotServices.getAll();

        return res.status(status).json({
            message,
            data, 
        });
    };

    one = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await DepotServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    create = async (req: Request, res: Response) => {
        const { status, message, data } = await DepotServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await DepotServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };
    
    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await DepotServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
    };

}