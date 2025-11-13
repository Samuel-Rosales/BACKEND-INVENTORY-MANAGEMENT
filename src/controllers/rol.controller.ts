import type { Request, Response } from "express";
import { RolServices } from "../services";

export class RolController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await RolServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => {
        const { id } = req.params
        const { status, message, data } = await RolServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data
        });
    };

    create = async (req: Request, res: Response) => {

        const { permission_ids, ...rolData } = req.body;

            // 3. Llamar al servicio con los DOS argumentos separados
        const { status, message, data } = await RolServices.create(
            rolData,         // El objeto 'rol: RolInterface'
            permission_ids   // El array 'permission_ids?: number[]'
        );

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await RolServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await RolServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
    };

    assignPermissions = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { permission_ids } = req.body;
        const { status, message, data } = await RolServices.assignPermissions(Number(id), permission_ids);

        return res.status(status).json({
            message,
            data,
        });
    };

    removePermissions = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { permission_ids } = req.body;
        const { status, message, data } = await RolServices.removePermissions(Number(id), permission_ids);

        return res.status(status).json({
            message,
            data,
        });
    };
}