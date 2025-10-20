import type { Request, Response } from "express";
import { UserServices } from "../services";

export class UserController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await UserServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => {
        const { ci } = req.params;
        const { status, message, data } = await UserServices.getOne(ci);

        return res.status(status).json({
            message,
            data,
        });
    };

    create = async (req: Request, res: Response) => {
        const { status, message, data } = await UserServices.create(req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const ci = req.params.id;
        const { status, message, data } = await UserServices.update(ci, req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { ci } = req.params;
        const { status, message } = await UserServices.delete(ci);

        return res.status(status).json({
            message,
        });
    };
}