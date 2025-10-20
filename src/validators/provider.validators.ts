import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { ProviderDB } from "../config";

export class ProviderValidators {
    
    validateCreateFields = [
        check("name")
            .notEmpty().withMessage("El nombre del proveedor es obligatorio.")
            .isString().withMessage("El nombre del proveedor debe ser una cadena de texto."),

        check("located")
            .notEmpty().withMessage("La ubicación del proveedor es obligatoria.")
            .isString().withMessage("La ubicación del proveedor debe ser una cadena de texto."),
    ];

    validateUpdateFields = [
        check("name")
            .optional()
            .notEmpty().withMessage("El nombre del proveedor es obligatorio.")
            .isString().withMessage("El nombre del proveedor debe ser una cadena de texto."),

        check("located")
            .optional()
            .notEmpty().withMessage("La ubicación del proveedor es obligatoria.")
            .isString().withMessage("La ubicación del proveedor debe ser una cadena de texto."),
    ];

    validateProviderParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const provider_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(provider_id) || !Number.isInteger(provider_id)) {
                return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
            }

            if (provider_id <= 0) {
                return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingProvider = await ProviderDB.findByPk(provider_id);
            if (!existingProvider) {
                return res.status(404).json({ message: `Tipo de pago con ID '${provider_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateProviderParamIdExists.",
            });
        }
    };
}  

export const providerValidators = new ProviderValidators();