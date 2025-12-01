import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { DepotDB, MovementDB, ProductDB } from "../models";

export class MovementValidator {

     validateCreateFields = [
        // --- depot_id ---
        check("depot_id")
            .notEmpty().withMessage("El almacén del movimiento es obligatorio.")
            .isNumeric().withMessage("El ID del almacén debe ser un número entero."),

        // --- product_id ---
        check("product_id")
            .notEmpty().withMessage("El producto del movimiento es obligatorio.")
            .isNumeric().withMessage("El ID del producto debe ser un número entero."),

        // --- user_ci ---
        check("user_ci")
            .notEmpty().withMessage("La cédula del usuario es obligatoria.")
            .isString().withMessage("La cédula del usuario debe ser una cadena de texto."),

        // --- type ---
        check("type")
            .notEmpty().withMessage("El tipo del movimiento es obligatorio.")
            .isIn(["Compra", "Venta", "Ajuste Positivo", "Ajuste Negativo"]).withMessage("El tipo del movimiento debe ser uno de: Entrada, Salida."),
        
        // --- amount ---
        check("amount")
            .notEmpty().withMessage("La cantidad del movimiento es obligatoria.")
            .isNumeric().withMessage("La cantidad del movimiento debe ser un número entero."),

        // --- observation ---
        check("observation")
            .notEmpty().withMessage("La observación del movimiento es obligatoria.")
            .isString().withMessage("La observación del movimiento debe ser una cadena de texto."),
    ];

    validateUpdateMovementFields = [
        // --- depot_id ---
        check("depot_id")
            .optional()
            .notEmpty().withMessage("El almacén del movimiento no puede estar vacío.") // Verifica si existe el campo y no está vacío
            .isNumeric().withMessage("El ID del almacén debe ser un número entero."),

        // --- product_id ---
        check("product_id")
            .optional()
            .notEmpty().withMessage("El producto del movimiento no puede estar vacío.")
            .isNumeric().withMessage("El ID del producto debe ser un número entero."),

        // --- user_ci ---
        check("user_ci")
            .optional()
            .notEmpty().withMessage("La cédula del usuario no puede estar vacía.")
            .isString().withMessage("La cédula del usuario debe ser una cadena de texto."),

        // --- type ---
        check("type")
            .optional()
            .notEmpty().withMessage("El tipo del movimiento no puede estar vacío.")
            .isIn(["Compra", "Venta", "Ajuste Positivo", "Ajuste Negativo"]).withMessage("El tipo del movimiento debe ser uno de: Entrada, Salida."),
        
        // --- amount ---
        check("amount")
            .optional()
            .notEmpty().withMessage("La cantidad del movimiento no puede estar vacía.")
            .isNumeric().withMessage("La cantidad del movimiento debe ser un número entero."),

        // --- observation ---
        check("observation")
            .optional()
            .notEmpty().withMessage("La observación del movimiento no puede estar vacía.")
            .isString().withMessage("La observación del movimiento debe ser una cadena de texto."),

        // --- status ---
        check("status")
            .optional()
            .notEmpty().withMessage("El estado del movimiento no puede estar vacío.")
            .isBoolean().withMessage("El estado del movimiento debe ser un valor booleano."),
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
                    message: `El ID "${rawId}" no puede ser un numero negativo.` 
                });
            }

            // consulta DB
            const existingProduct = await ProductDB.findByPk(product_id);

            if (!existingProduct) {
                return res.status(404).json({ 
                    message: `Producto con ID "${product_id}" no encontrado.`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateProductIdExists.",
            });
        }
    }

    validateMovementParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const movement_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(movement_id) || !Number.isInteger(movement_id) || movement_id <= 0) {
                return res.status(400).json({
                    message: `El ID del movimiento proporcionado "${rawId}" no es válido.`,
                });
            }

            const existingMoviment = await MovementDB.findByPk(movement_id);

            
            if (!existingMoviment) {
                return res.status(404).json({
                    message: `Movimiento con ID "${movement_id}" no encontrado.`
                });
        
            }
            
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateMovementParamIdExists.",
            });
        }
    };
}

export const movementValidators = new MovementValidator();