import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { PermissionDB } from "../models";

export class PermissionValidator {

    validateCreateFields = [
        check("code")
            .notEmpty().withMessage("El código del permiso es obligatorio.")
            .isString().withMessage("El código debe ser una cadena de texto.")
            .isLength({ max: 100 }).withMessage("El código no debe exceder los 100 caracteres."),

        check("name")
            .notEmpty().withMessage("El nombre del permiso es obligatorio.")
            .isString().withMessage("El nombre debe ser una cadena de texto.")
            .isLength({ max: 255 }).withMessage("El nombre no debe exceder los 255 caracteres."),

        check("description")
            .optional() // Opcional porque 'allowNull: true'
            .isString().withMessage("La descripción debe ser una cadena de texto."),
        
        check("status")
            .optional() // Opcional porque tiene un 'defaultValue'
            .isBoolean().withMessage("El estado debe ser un valor booleano (true/false).")
    ];

    validateUpdateFields = [
        check("code")
            .optional()
            .notEmpty().withMessage("El código no puede estar vacío.")
            .isString().withMessage("El código debe ser una cadena de texto.")
            .isLength({ max: 100 }).withMessage("El código no debe exceder los 100 caracteres."),

        check("name")
            .optional()
            .notEmpty().withMessage("El nombre no puede estar vacío.")
            .isString().withMessage("El nombre debe ser una cadena de texto.")
            .isLength({ max: 255 }).withMessage("El nombre no debe exceder los 255 caracteres."),

        check("description")
            .optional()
            .isString().withMessage("La descripción debe ser una cadena de texto."),
        
        check("status")
            .optional()
            .notEmpty().withMessage("El estado no puede estar vacío.") // Si se envía, no debe ser vacío
            .isBoolean().withMessage("El estado debe ser un valor booleano (true/false).")
    ];

    validatePermissionParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            const rol_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(rol_id) || !Number.isInteger(rol_id) || rol_id <= 0) {
                return res.status(400).json({
                    message: `El ID de permiso "${rawId}" no es válido.`,
                });
            }

            const existingPermission = await PermissionDB.findByPk(rol_id);

            if (!existingPermission) {
                return res.status(404).json({
                    message: `Permiso con ID "${rol_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validatePermissionParamIdExists.",
            });
        }
    };
}

export const permissionValidators = new PermissionValidator();