import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { ClientDB } from "../models";

export class ClientValidators {
    
    validateCreateFields = [
        check("client_ci")
            .notEmpty().withMessage("La cédula del cliente es obligatoria.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula debe ser una cadena de texto."),

        check("name")
            .notEmpty().withMessage("El nombre del cliente es obligatorio.")
            .isString().withMessage("El nombre del cliente debe ser una cadena de texto."),

        check("phone")
            .notEmpty().withMessage("El teléfono del cliente es obligatoria.")
            .isString().withMessage("El teléfono del cliente debe ser una cadena de texto."),
        
        check("address")
            .notEmpty().withMessage("La dirección del cliente es obligatoria.")
            .isString().withMessage("La dirección del cliente debe ser una cadena de texto."),
    ];

    validateUpdateFields = [
        check("name")
            .optional()
            .notEmpty().withMessage("El nombre del cliente es obligatorio.")
            .isString().withMessage("El nombre del cliente debe ser una cadena de texto."),

        check("phone")
            .optional()
            .notEmpty().withMessage("La teléfono del cliente es obligatoria.")
            .isString().withMessage("La teléfono del cliente debe ser una cadena de texto."),
        
        check("address")
            .optional()
            .notEmpty().withMessage("La dirección del cliente es obligatoria.")
            .isString().withMessage("La dirección del cliente debe ser una cadena de texto."),
        
        check("status")
            .optional()
            .notEmpty().withMessage("El estado del cliente no puede estar vacío.")
            .isBoolean().withMessage("El estado debe ser un valor booleano."),
    ];

    validateClientParamCIExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const client_ci = (req.params.id ?? "").toString().trim();
            if (!client_ci) return next();
            

            if (!client_ci || client_ci.length < 6 || client_ci.length > 10 || !/^\d{6,10}$/.test(client_ci)) {
                return res.status(400).json({
                message: `La cédula proporcionada '${client_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                });
            }

            const existingClient = await ClientDB.findByPk(client_ci);

            if (!existingClient) {
                return res.status(404).json({ message: `Cliente con la cédula '${client_ci}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateClientParamCIExists.",
            });
        }
    };
}  

export const clientValidators = new ClientValidators();