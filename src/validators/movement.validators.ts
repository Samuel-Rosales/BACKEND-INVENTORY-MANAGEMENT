import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { DepotDB, MovementDB, ProductDB } from "../config";

export class MovementValidator {

    validateFields = [
        check("depot_id", "El almacén del movimiento es obligatorio.").not().isEmpty(),
        check("depot_id", "El ID del almacén del movimiento debe ser un número entero.").isNumeric(),

        check("product_id", "El producto del movimiento es obligatorio.").not().isEmpty(),
        check("product_id", "El ID del producto del almacén debe ser un número entero.").isNumeric(),

        check("type", "El tipo del movimiento es obligatorio.").not().isEmpty(),
        check("type", "El tipo del movimiento debe ser uno de: Entrada, Salida.").optional().isIn(["Entrada", "Salida"]),
        
        check("amount", "La cantidad del movimiento es obligatorio.").not().isEmpty(),
        check("amount", "La cantidad del movimiento debe ser un número entero.").isNumeric(),

        check("observation", "La observación del movimiento es obligatorio.").not().isEmpty(),
        check("observation", "La observación del movimiento debe ser una cadena de texto.").isString(),

        check("status", "El estado del movimiento es obligatorio.").not().isEmpty(),
        check("status", "El estado del movimiento debe ser un valor booleano.").isBoolean(),
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
    };
}

export const movementValidators = new MovementValidator();