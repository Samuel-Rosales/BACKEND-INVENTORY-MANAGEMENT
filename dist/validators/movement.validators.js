"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movementValidators = exports.MovementValidator = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
class MovementValidator {
    constructor() {
        this.validateCreateFields = [
            // --- depot_id ---
            (0, express_validator_1.check)("depot_id")
                .notEmpty().withMessage("El almacén del movimiento es obligatorio.")
                .isNumeric().withMessage("El ID del almacén debe ser un número entero."),
            // --- product_id ---
            (0, express_validator_1.check)("product_id")
                .notEmpty().withMessage("El producto del movimiento es obligatorio.")
                .isNumeric().withMessage("El ID del producto debe ser un número entero."),
            // --- type ---
            (0, express_validator_1.check)("type")
                .notEmpty().withMessage("El tipo del movimiento es obligatorio.")
                .isIn(["Entrada", "Salida"]).withMessage("El tipo del movimiento debe ser uno de: Entrada, Salida."),
            // --- amount ---
            (0, express_validator_1.check)("amount")
                .notEmpty().withMessage("La cantidad del movimiento es obligatoria.")
                .isNumeric().withMessage("La cantidad del movimiento debe ser un número entero."),
            // --- observation ---
            (0, express_validator_1.check)("observation")
                .notEmpty().withMessage("La observación del movimiento es obligatoria.")
                .isString().withMessage("La observación del movimiento debe ser una cadena de texto."),
        ];
        this.validateUpdateMovementFields = [
            // --- depot_id ---
            (0, express_validator_1.check)("depot_id")
                .optional()
                .notEmpty().withMessage("El almacén del movimiento no puede estar vacío.") // Verifica si existe el campo y no está vacío
                .isNumeric().withMessage("El ID del almacén debe ser un número entero."),
            // --- product_id ---
            (0, express_validator_1.check)("product_id")
                .optional()
                .notEmpty().withMessage("El producto del movimiento no puede estar vacío.")
                .isNumeric().withMessage("El ID del producto debe ser un número entero."),
            // --- type ---
            (0, express_validator_1.check)("type")
                .optional()
                .notEmpty().withMessage("El tipo del movimiento no puede estar vacío.")
                .isIn(["Entrada", "Salida"]).withMessage("El tipo del movimiento debe ser uno de: Entrada, Salida."),
            // --- amount ---
            (0, express_validator_1.check)("amount")
                .optional()
                .notEmpty().withMessage("La cantidad del movimiento no puede estar vacía.")
                .isNumeric().withMessage("La cantidad del movimiento debe ser un número entero."),
            // --- observation ---
            (0, express_validator_1.check)("observation")
                .optional()
                .notEmpty().withMessage("La observación del movimiento no puede estar vacía.")
                .isString().withMessage("La observación del movimiento debe ser una cadena de texto."),
            // --- status ---
            (0, express_validator_1.check)("status")
                .optional()
                .notEmpty().withMessage("El estado del movimiento no puede estar vacío.")
                .isBoolean().withMessage("El estado del movimiento debe ser un valor booleano."),
        ];
        this.validateDepotIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.depot_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const depot_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                    return res.status(400).json({
                        message: `El ID del almacén proporcionado "${rawId}" no es válido.`,
                    });
                }
                const exitingDepot = await models_1.DepotDB.findByPk(depot_id);
                if (!exitingDepot) {
                    return res.status(404).json({
                        message: `Almacén con ID proporcionado "${depot_id}" no encontrado.`,
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateDepotExists.",
                });
            }
        };
        this.validateProductIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.product_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
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
                const existingProduct = await models_1.ProductDB.findByPk(product_id);
                if (!existingProduct) {
                    return res.status(404).json({
                        message: `Producto con ID "${product_id}" no encontrado.`
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateProductIdExists.",
                });
            }
        };
        this.validateMovementParamIdExists = async (req, res, next) => {
            var _a;
            const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
            if (!rawId)
                return next();
            const movement_id = Number.parseInt(rawId, 10);
            if (Number.isNaN(movement_id) || !Number.isInteger(movement_id) || movement_id <= 0) {
                return res.status(400).json({
                    message: `El ID del movimiento proporcionado "${rawId}" no es válido.`,
                });
            }
            const existingMoviment = await models_1.MovementDB.findByPk(movement_id);
            if (!existingMoviment) {
                return res.status(404).json({
                    message: `Movimiento con ID "${movement_id}" no encontrado.`
                });
            }
        };
    }
}
exports.MovementValidator = MovementValidator;
exports.movementValidators = new MovementValidator();
