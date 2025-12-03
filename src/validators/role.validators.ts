import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { RoleeDB } from "../models";

export class RoleValidator {

    validateFields = [
        check("name", "El nombre del role es obligatorio.").not().isEmpty(),    
        check("name", "El nombre del role debe ser una cadena de texto.").isString(),   
    ];

    validateRoleParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            const role_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(role_id) || !Number.isInteger(role_id) || role_id <= 0) {
                return res.status(400).json({
                    message: `El ID de role "${rawId}" no es válido.`,
                });
            }

            const existingRole = await RoleeDB.findByPk(role_id);

            if (!existingRole) {
                return res.status(404).json({
                    message: `Rolee con ID "${role_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateRoleParamIdExists.",
            });
        }
    };
}

export const rolValidators = new RoleValidator();