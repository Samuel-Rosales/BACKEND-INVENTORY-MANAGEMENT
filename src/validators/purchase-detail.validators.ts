import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { SaleDetailDB, PurchaseDB, ProductDB } from "../models";

export class PurchaseDetailValidators {
    
    validateCreateFields = [
        check("product_id")
            .notEmpty().withMessage("El ID del producto es obligatorio.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("purchase_id")
            .notEmpty().withMessage("El ID de la compra es obligatorio.")
            .isInt().withMessage("El ID de la compra debe ser un número entero."),

        check("unit_cost")
            .notEmpty().withMessage("El costo unitario del producto es obligatorio.")
            .isDecimal().withMessage("El costo unitario del producto debe ser un número decimal."),
        
        check("amount")
            .notEmpty().withMessage("La cantidad del producto es obligatorio.")
            .isInt().withMessage("La cantidad del producto debe ser un número entero."),
    ];

    validateUpdateFields = [
        check("product_id")
            .optional()
            .notEmpty().withMessage("El ID del producto es obligatorio.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("sale_id")
            .optional()
            .notEmpty().withMessage("El ID de la venta es obligatorio.")
            .isInt().withMessage("El ID de la venta debe ser un número entero."),

        check("unit_cost")
            .optional()
            .notEmpty().withMessage("El costo unitario del producto es obligatorio.")
            .isDecimal().withMessage("El costo unitario del producto debe ser un número decimal."),
        
        check("amount")
            .optional()
            .notEmpty().withMessage("La cantidad del producto es obligatorio.")
            .isInt().withMessage("La cantidad del producto debe ser un número entero."),
        
        check("status")
            .optional()
            .notEmpty().withMessage("El estado del detalle de la compra no puede estar vacío.")
            .isBoolean().withMessage("El estado del detalle de la compra debe ser un valor booleano."),
    ];

    validateProductIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.product_id ?? "").toString().trim();
            if (!rawId) return next();

            const product_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(product_id) || !Number.isInteger(product_id)) {
                return res.status(400).json({ 
                    message: `El ID proporcionado "${rawId}" no es un número entero válido.` 
                });
            }

            if (product_id <= 0) {
                return res.status(400).json({ 
                    message: `El ID '${rawId}' no puede ser un numero negativo.` 
                });
            }

            // consulta DB
            const existingProduct = await ProductDB.findByPk(product_id);

            if (!existingProduct) {
                return res.status(404).json({ 
                    message: `Producto con ID '${product_id}' no encontrado.`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateProductIdExists.",
            });
        }
    }

    validatePurchaseIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.purchase_id ?? "").toString().trim();
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
                message: "Internal server error in validatePurchaseIdExists.",
            });
        }
    };

    validatePurchaseDetailParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const purchase_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(purchase_id) || !Number.isInteger(purchase_id)) {
                return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
            }

            if (purchase_id <= 0) {
                return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingSale = await SaleDetailDB.findByPk(purchase_id);
            if (!existingSale) {
                return res.status(404).json({ message: `Detalle de compra con ID '${purchase_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validatePurchaseDetailParamIdExists.",
            });
        }
    };
}

export const purchaseDetailValidators = new PurchaseDetailValidators();