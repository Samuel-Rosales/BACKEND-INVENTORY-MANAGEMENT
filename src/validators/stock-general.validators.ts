import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { DepotDB, ProductDB, StockGeneralDB } from "../models";

export class StockGeneralValidators {

    validateCreateFields = [
        check("product_id")
            .notEmpty().withMessage("El ID del producto es obligatorio.")
            .isInt().withMessage("El ID del producto debe ser un número entero."),

        check("depot_id")
            .notEmpty().withMessage("El ID del almacén es obligatorio.")
            .isInt().withMessage("El ID del almacén debe ser un número entero."),

        check("amount")
            .notEmpty().withMessage("La cantidad es obligatoria.")
            .isInt({ min: 0 }).withMessage("La cantidad debe ser un número entero igual o mayor que 0."),

        check("status")
            .optional() // Es opcional porque tiene un defaultValue
            .isBoolean().withMessage("El estado debe ser un valor booleano (true/false).")
    ];

    validateUpdateFields = [
        check("amount")
            .optional()
            .notEmpty().withMessage("La cantidad no puede estar vacía.")
            .isInt({ min: 0 }).withMessage("La cantidad debe ser un número entero igual o mayor que 0."),

        check("status")
            .optional()
            .notEmpty().withMessage("El estado no puede estar vacío.") // Si se envía, no debe ser null
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

    validateStockGeneralParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_id: rawProductId, depot_id: rawDepotId } = req.params;

            // 2. Validar product_id
            const product_id = Number.parseInt(rawProductId, 10);
            if (Number.isNaN(product_id) || !Number.isInteger(product_id) || product_id <= 0) {
                return res.status(400).json({ message: `El product_id '${rawProductId}' no es un número válido.` });
            }
            
            // 3. Validar depot_id
            const depot_id = Number.parseInt(rawDepotId, 10);
            if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                return res.status(400).json({ message: `El depot_id '${rawDepotId}' no es un número válido.` });
            }

            // 4. Buscar en la DB usando findOne y 'where' (NO findByPk)
            const existingStockGeneral = await StockGeneralDB.findOne({
                where: { product_id, depot_id }
            });

            if (!existingStockGeneral) {
                return res.status(404).json({ message: `Stock general con ID de producto: '${product_id}' y ID de depósito: '${depot_id}' no encontrado.` });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateStockGeneralParamIdExists.",
            });
        }
    };
}

export const stockgeneralValidators = new StockGeneralValidators();