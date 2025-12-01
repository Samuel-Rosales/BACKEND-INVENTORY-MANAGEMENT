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

    getPermissionsByRolId = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await RolServices.getPermissionsByRolId(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    checkRolePermission = async (req: Request, res: Response) => {
        try {
            const { role_id, permission_code } = req.body;

            if (!role_id || !permission_code) {
                return res.status(400).json({
                    message: "role_id and permission_code are required",
                    data: null
                });
            }

            const hasPermission = await RolServices.checkPermission(role_id, permission_code);

            return res.status(200).json({
                message: "Permission check executed",
                data: {
                    role_id: role_id,
                    permission_code: permission_code,
                    has_permission: hasPermission // true o false
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
                data: null
            });
        }
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