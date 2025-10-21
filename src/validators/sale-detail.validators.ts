import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { SaleDetailDB, SaleDB, ProductDB } from "../config";

export class SaleDetailValidators {
    
    validateCreateFields = [
        check("product_id")
            .notEmpty().withMessage("El ID del producto es obligatorio.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("sale_id")
            .notEmpty().withMessage("El ID de la venta es obligatorio.")
            .isInt().withMessage("El ID de la venta debe ser un número entero."),

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
            .notEmpty().withMessage("El estado del detalle de la venta no puede estar vacío.")
            .isBoolean().withMessage("El estado del detalle de la venta debe ser un valor booleano."),
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

    validateSaleIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.sale_id ?? "").toString().trim();
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
                message: "Internal server error in validateSaleIdExists.",
            });
        }
    };

    validateSaleDetailParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
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
            const existingSale = await SaleDetailDB.findByPk(sale_id);
            if (!existingSale) {
                return res.status(404).json({ message: `Detalle de venta con ID '${sale_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateSaleDetailParamIdExists.",
            });
        }
    };
}

export const saleDetailValidators = new SaleDetailValidators();