import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { PurchaseDB, ProviderDB, TypePaymentDB, UserDB } from "../config";

export class PurchaseValidators {
    
    validateCreateFields = [
        check("provider_id")
            .notEmpty().withMessage("El ID del proveedor es obligatorio.")
            .isInt().withMessage("El ID del proveedor debe ser un número entero."),

        check("user_ci")
            .notEmpty().withMessage("La cédula del usuario es obligatoria.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula debe ser una cadena de texto."),

        check("type_payment_id")
            .notEmpty().withMessage("El ID del tipo de pago es obligatorio.")
            .isInt().withMessage("El ID del tipo de pago debe ser un número entero."),
    ];

    validateUpdateFields = [
        check("provider_id")
            .optional()
            .notEmpty().withMessage("El ID del proveedor no puede estar vacío.")
            .isInt().withMessage("El ID del proveedor debe ser un número entero."),

        check("user_ci")
            .optional()
            .notEmpty().withMessage("La cédula no puede estar vacía.")
            .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
            .isString().withMessage("La cédula debe ser una cadena de texto."),

        check("type_payment_id")
            .optional()
            .notEmpty().withMessage("El ID del tipo de pago no puede estar vacío.")
            .isInt().withMessage("El ID del tipo de pago debe ser un número entero."),
        
        check("status")
            .optional()
            .notEmpty().withMessage("El estado de la compra no puede estar vacío.")
            .isIn(["Pendiente", "Aprobado"]).withMessage("El estado de la compra debe ser uno de: Pendiente, Aprobado."),

        check("active")
            .optional()
            .notEmpty().withMessage("El campo activo de la compra no puede estar vacío.")
            .isBoolean().withMessage("El campo activo de la compra debe ser un valor booleano."),
    ];

    validateProviderIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.provider_id ?? "").toString().trim();
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
                return res.status(404).json({ message: `Proveedor con ID '${provider_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateProviderParamIdExists.",
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

    validatePurchaseParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const pruchase_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(pruchase_id) || !Number.isInteger(pruchase_id)) {
                return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
            }

            if (pruchase_id <= 0) {
                return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingPruchase = await PurchaseDB.findByPk(pruchase_id);
            if (!existingPruchase) {
                return res.status(404).json({ message: `Compra con ID '${pruchase_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validatePurchaseParamIdExists.",
            });
        }
    };
}

export const purchaseValidators = new PurchaseValidators();