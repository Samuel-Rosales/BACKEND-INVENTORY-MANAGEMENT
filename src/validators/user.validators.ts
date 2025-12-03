import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { RoleDB, UserDB } from "../models";

export class UserValidators {

    validateCreateFields = [
        check("user_ci")
            .notEmpty().withMessage("La cédula del usuario es obligatoria.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula debe ser una cadena de texto."),

        check("name")
            .notEmpty().withMessage("El nombre del usuario es obligatorio.")
            .isString().withMessage("El nombre debe ser una cadena de texto."),

        check("password")
            .notEmpty().withMessage("La contraseña es obligatoria.")
            .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres."),

        check("role_id")
            .notEmpty().withMessage("El ID del role es obligatorio.")
            .isInt().withMessage("El ID del role debe ser un número entero."),

        check("status")
            .notEmpty().withMessage("El estado del usuario es obligatorio.")
            .isBoolean().withMessage("El estado del usuario debe ser un valor booleano."),
    ];

    validateUpdateFields = [
        check("name")
            .optional()
            .notEmpty().withMessage("El nombre no puede estar vacío.")
            .isString().withMessage("El nombre debe ser una cadena de texto."),

        check("password")
            .optional()
            .notEmpty().withMessage("La contraseña no puede estar vacía.")
            .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres."),

        check("role_id")
            .optional()
            .notEmpty().withMessage("El ID del role no puede estar vacío.")
            .isInt().withMessage("El ID del role debe ser un número entero."),

        check("status")
            .optional()
            .notEmpty().withMessage("El estado no puede estar vacío.")
            .isBoolean().withMessage("El estado debe ser un valor booleano."),
    ];

    validateRoleIdExists = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const rawId = (req.body.role_id ?? "").toString().trim();
            const role_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(role_id) || !Number.isInteger(role_id) || role_id <= 0) {
                return res.status(400).json({
                    message: `El ID del role '${rawId}' no es válido.`,
                });
            }

            const role = await RoleDB.findByPk(role_id);
            
            if (!role) {
                return res.status(400).json({
                    message: `El role con ID '${role_id}' no existe.`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal server error in validaterolexists."
            }); 
        }
    }; 

    validateUserParamCIExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_ci = (req.params.user_ci ?? "").toString().trim();
            if (!user_ci) return next();
            

            if (!user_ci || user_ci.length < 6 || user_ci.length > 10 || !/^\d{6,10}$/.test(user_ci)) {
                return res.status(400).json({
                message: `La cédula proporcionada '${user_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                });
            }

            const existingUser = await UserDB.findByPk(user_ci);

            if (!existingUser) {
                return res.status(404).json({ message: `Usuario con la cédula '${user_ci}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateUserIdExists.",
            });
        }
    };

    validateUserAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const user_ci = (req.body.user_ci ?? "").toString().trim();
            if (!user_ci) return next();
            

            if (!user_ci || user_ci.length < 6 || user_ci.length > 10 || !/^\d{6,10}$/.test(user_ci)) {
                return res.status(400).json({
                message: `La cédula proporcionada '${user_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                });
            }

            const existingUser = await UserDB.findByPk(user_ci);

            if (existingUser) {
                return res.status(400).json({ message: `Ya existe un usuario registrado con la cédula: '${user_ci}'.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateUserAlreadyExists.",
            });
        }
    };
}

export const userValidators = new UserValidators();