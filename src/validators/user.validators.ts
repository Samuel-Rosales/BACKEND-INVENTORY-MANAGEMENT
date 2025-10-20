import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { RolDB, UserDB } from "../config";

export class UserValidators {

    validateCreateFields = [
        check("ci", "La cédula del usuario es obligatoria.").not().isEmpty(),
        check("ci", "La cédula debe tener entre 6 y 10 caracteres.").isLength({ min: 7, max: 8 }),
        check("ci", "La cédula debe ser una cadena de texto.").isString(),

        check("name", "El nombre del usuario es obligatorio.").not().isEmpty(),
        check("name", "El nombre del usuario debe ser una cadena de texto.").isString(),

        check("password", "La contraseña es obligatoria.").not().isEmpty(),
        check("password", "La contraseña debe tener al menos 6 caracteres.").isLength({ min: 6 }),

        check("rol_id", "El ID del rol es obligatorio.").not().isEmpty(),
        check("rol_id", "El ID del rol debe ser un número entero.").isInt(),

        check("status", "El estado del usuario es obligatorio.").not().isEmpty(),
        check("status", "El estado del usuario debe ser un valor booleano.").isBoolean(),
    ];

    validateUpdateFields = [
        check("name").optional().isString().withMessage("El nombre debe ser una cadena de texto."),
        check("password").optional().isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres."),
        check("rol_id").optional().isInt().withMessage("El ID del rol debe ser un número entero."),
        check("status").optional().isBoolean().withMessage("El estado debe ser un valor booleano."),
    ];

    validateRolIdExists = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const rawId = (req.body.rol_id ?? "").toString().trim();
            const rol_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(rol_id) || !Number.isInteger(rol_id) || rol_id <= 0) {
                return res.status(400).json({
                    message: `El ID del rol "${rawId}" no es válido.`,
                });
            }

            const rol = await RolDB.findByPk(rol_id);
            
            if (!rol) {
                return res.status(400).json({
                    message: `El rol con ID "${rol_id}" no existe.`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal server error in validateRolExists."
            }); 
        }
    }; 

    validateUserParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_ci = (req.params.id ?? "").toString().trim();
            if (!user_ci) return next();
            

            if (!user_ci || user_ci.length < 6 || user_ci.length > 10 || !/^\d{6,10}$/.test(user_ci)) {
                return res.status(400).json({
                message: `La cédula proporcionada "${user_ci}" no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                });
            }


            const existingUser = await UserDB.findByPk(user_ci);

            if (!existingUser) {
                return res.status(404).json({ message: `Producto con ID "${user_ci}" no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateUserIdExists.",
            });
        }
    };
}

export const userValidators = new UserValidators();