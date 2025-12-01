import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { DepotDB, ProductDB, StockLotDB } from "../models";

export class StockLotValidators {

    validateCreateFields = [
        check("product_id")
            .notEmpty().withMessage("El ID del producto es obligatorio.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("depot_id")
            .notEmpty().withMessage("El ID del almacén es obligatorio.")
            .isInt().withMessage("El ID del almacén debe ser un número entero."),

        check("expiration_date")
            .notEmpty().withMessage("La fecha de vencimiento es obligatoria.")
            .isISO8601().toDate().withMessage("Debe ser una fecha válida (formato YYYY-MM-DD)."),

        check("amount")
            .notEmpty().withMessage("La cantidad es obligatoria.")
            .isInt({ gt: 0 }).withMessage("La cantidad debe ser un número entero mayor que 0."),

        check("cost_lot")
            .notEmpty().withMessage("El costo del lote es obligatorio.")
            .isDecimal().withMessage("El costo del lote debe ser un número decimal."),

        check("status")
            .optional() // Es opcional porque tiene un defaultValue
            .isBoolean().withMessage("El estado debe ser un valor booleano (true/false).")
    ];

    validateUpdateFields = [
        check("product_id")
            .optional()
            .notEmpty().withMessage("El ID del producto no puede estar vacío.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("depot_id")
            .optional()
            .notEmpty().withMessage("El ID del almacén no puede estar vacío.")
            .isInt().withMessage("El ID del almacén debe ser un número entero."),

        check("expiration_date")
            .optional()
            .notEmpty().withMessage("La fecha de vencimiento no puede estar vacía.")
            .isISO8601().toDate().withMessage("Debe ser una fecha válida (formato YYYY-MM-DD)."),

        check("amount")
            .optional()
            .notEmpty().withMessage("La cantidad no puede estar vacía.")
            .isInt({ gt: 0 }).withMessage("La cantidad debe ser un número entero mayor que 0."),

        check("cost_lot")
            .optional()
            .notEmpty().withMessage("El costo del lote no puede estar vacío.")
            .isDecimal().withMessage("El costo del lote debe ser un número decimal."),

        check("status")
            .optional()
            .notEmpty().withMessage("El estado no puede estar vacío.")
            .isBoolean().withMessage("El estado debe ser un valor booleano (true/false).")
    ];

    validateDepotIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.depot_id ?? "").toString().trim();
            const depot_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                return res.status(400).json({
                    message: `El ID del almacén proporcionado "${rawId}" no es válido.`, 
                });
            }

            const exitingDepot = await DepotDB.findByPk(depot_id);

            if (!exitingDepot) {
                return res.status(404).json({
                    message: `Almacén con ID proporcionado "${depot_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateDepotExists.",
            });
        }
    };

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
    };

    validateProductParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.product_id ?? "").toString().trim();
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
                message: "Internal server error in validateProductParamIdExists.",
            });
        }
    };

    validateStockLotParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const stock_lot_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(stock_lot_id) || !Number.isInteger(stock_lot_id)) {
                return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
            }

            if (stock_lot_id <= 0) {
                return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
            }

            // consulta DB
            const existingStockLot = await StockLotDB.findByPk(stock_lot_id);
            if (!existingStockLot) {
                return res.status(404).json({ message: `Stock por lotes con ID '${stock_lot_id}' no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateStockLotParamIdExists.",
            });
        }
    };
}

export const stockLotValidators = new StockLotValidators();