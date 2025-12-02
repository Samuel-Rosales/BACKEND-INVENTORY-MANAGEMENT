import type { Request, Response } from "express";
import { RoleServices } from "../services";

export class RoleController {
    constructor() {}

    all = async (req: Request, res: Response) => {
        const { status, message, data } = await RoleServices.getAll();

        return res.status(status).json({
            message,
            data,
        });
    };

    one = async (req: Request, res: Response) => {
        const { id } = req.params
        const { status, message, data } = await RoleServices.getOne(Number(id));

        return res.status(status).json({
            message,
            data
        });
    };

    getPermissionsByRoleId = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await RoleServices.getPermissionsByRoleId(Number(id));

        return res.status(status).json({
            message,
            data,
        });
    };

    checkRoleePermission = async (req: Request, res: Response) => {
        try {
            const { role_id, permission_code } = req.body;

            if (!role_id || !permission_code) {
                return res.status(400).json({
                    message: "role_id and permission_code are required",
                    data: null
                });
            }

            const hasPermission = await RoleServices.checkPermission(role_id, permission_code);

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
        const { status, message, data } = await RoleServices.create(
            rolData,         // El objeto 'role: RoleInterface'
            permission_ids   // El array 'permission_ids?: number[]'
        );

        return res.status(status).json({
            message,
            data,
        });
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message, data } = await RoleServices.update(Number(id), req.body);

        return res.status(status).json({
            message,
            data,
        });
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, message } = await RoleServices.delete(Number(id));

        return res.status(status).json({
            message,
        });
    };

    assignPermissions = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { permission_ids } = req.body;
        const { status, message, data } = await RoleServices.assignPermissions(Number(id), permission_ids);

        return res.status(status).json({
            message,
            data,
        });
    };

    removePermissions = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { permission_ids } = req.body;
        const { status, message, data } = await RoleServices.removePermissions(Number(id), permission_ids);

        return res.status(status).json({
            message,
            data,
        });
    };
}