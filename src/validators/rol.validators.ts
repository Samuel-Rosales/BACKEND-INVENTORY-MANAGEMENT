import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { RolDB } from "../models";

export class RolValidator {

    validateFields = [
        check("name", "El nombre del rol es obligatorio.").not().isEmpty(),    
        check("name", "El nombre del rol debe ser una cadena de texto.").isString(),   
    ];

    validateRolParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            const rol_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(rol_id) || !Number.isInteger(rol_id) || rol_id <= 0) {
                return res.status(400).json({
                    message: `El ID de rol "${rawId}" no es válido.`,
                });
            }

            const existingRol = await RolDB.findByPk(rol_id);

            if (!existingRol) {
                return res.status(404).json({
                    message: `Rol con ID "${rol_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateRolParamIdExists.",
            });
        }
    };
}

export const rolValidators = new RolValidator();