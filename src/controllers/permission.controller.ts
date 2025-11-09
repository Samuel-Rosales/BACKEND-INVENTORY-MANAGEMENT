import type { Request, Response } from "express";
import { PermisionServices } from "../services";

export class PermissionController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await PermisionServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => {
        const { id } = req.params
        const { status, message, data } = await PermisionServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data
        });
    };

    create = async (req: Request, res: Response) => {
        const { status, message, data } = await PermisionServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await PermisionServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await PermisionServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
    };
}