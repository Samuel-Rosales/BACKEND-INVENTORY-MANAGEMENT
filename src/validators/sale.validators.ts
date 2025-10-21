import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { SaleDB, ClientDB, TypePaymentDB, UserDB } from "../models";

export class SaleValidators {
    
    validateCreateFields = [
        check("client_ci")
            .notEmpty().withMessage("La cédula del cliente no puede estar vacía.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula del cliente debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula del cliente debe ser una cadena de texto."),

        check("user_ci")
            .notEmpty().withMessage("La cédula del usuario es obligatoria.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula debe ser una cadena de texto."),

        check("type_payment_id")
            .notEmpty().withMessage("El ID del tipo de pago es obligatorio.")
            .isInt().withMessage("El ID del tipo de pago debe ser un número entero."),
    ];

    validateUpdateFields = [
        check("client_ci")
            .optional()
            .notEmpty().withMessage("La cédula del cliente no puede estar vacía.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula del cliente debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula del cliente debe ser una cadena de texto."),

        check("user_ci")
            .optional()
            .notEmpty().withMessage("La cédula del usuario no puede estar vacía.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula del usuario debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula del usuario debe ser una cadena de texto."),

        check("type_payment_id")
            .optional()
            .notEmpty().withMessage("El ID del tipo de pago no puede estar vacío.")
            .isInt().withMessage("El ID del tipo de pago debe ser un número entero."),

        check("status")
            .optional()
            .notEmpty().withMessage("El estado de la compra no puede estar vacío.")
            .isBoolean().withMessage("El estado de la compra debe ser un valor booleano."),
    ];

    validateClientCIExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const client_ci = (req.body.client_ci ?? "").toString().trim();
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
                message: "Internal server error in validateClientCIExists.",
            });
        }
    };

    validateTypePaymentIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.type_payment_id ?? "").toString().trim();
            if (!rawId) return next();

            const type_payment_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(type_payment_id) || !Number.isInteger(type_payment_id)) {
                return res.status(400).json({ message: `El ID proporcionado "${rawId}" no es un número entero válido.` });
            }

            if (type_payment_id <= 0) {
                return res.status(400).json({ message: `El ID "${rawId}" no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingTypePayment = await TypePaymentDB.findByPk(type_payment_id);
            if (!existingTypePayment) {
                return res.status(404).json({ message: `Tipo de pago con ID "${type_payment_id}" no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateTypePaymentParamIdExists.",
            });
        }
    };

    validateUserCIExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_ci = (req.body.user_ci ?? "").toString().trim();
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
                message: "Internal server error in validateUserCIExists.",
            });
        }
    };

    validateSaleParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const sale_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(sale_id) || !Number.isInteger(sale_id)) {
                return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
            }

            if (sale_id <= 0) {
                return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingSale = await SaleDB.findByPk(sale_id);
            if (!existingSale) {
                return res.status(404).json({ message: `Venta con ID '${sale_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateSaleParamIdExists.",
            });
        }
    };
}

export const saleValidators = new SaleValidators();