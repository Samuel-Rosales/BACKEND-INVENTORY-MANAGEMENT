import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { TypePaymentDB } from "../config";

export class TypePaymentValidators {
    
   validateFields = [
    check("name")
        .notEmpty().withMessage("El nombre del tipo de pago es obligatorio.")
        .isString().withMessage("El nombre del tipo de pago debe ser una cadena de texto."),
    ];

    validateTypePaymentParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
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
}  

export const typePaymentValidators = new TypePaymentValidators();