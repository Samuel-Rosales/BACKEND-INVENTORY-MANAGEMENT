"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movementValidators = exports.MovementValidator = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class MovementValidator {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("depot_id", "El almacén del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("depot_id", "El ID del almacén del movimiento debe ser un número entero.").isNumeric(),
            (0, express_validator_1.check)("product_id", "El producto del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("product_id", "El ID del producto del almacén debe ser un número entero.").isNumeric(),
            (0, express_validator_1.check)("type", "El tipo del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("type", "El tipo del movimiento debe ser uno de: Entrada, Salida.").optional().isIn(["Entrada", "Salida"]),
            (0, express_validator_1.check)("amount", "La cantidad del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("amount", "La cantidad del movimiento debe ser un número entero.").isNumeric(),
            (0, express_validator_1.check)("observation", "La observación del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("observation", "La observación del movimiento debe ser una cadena de texto.").isString(),
            (0, express_validator_1.check)("status", "El estado del movimiento es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("status", "El estado del movimiento debe ser un valor booleano.").isBoolean(),
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
                const exitingDepot = await config_1.DepotDB.findByPk(depot_id);
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
                const existingProduct = await config_1.ProductDB.findByPk(product_id);
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
            const existingMoviment = await config_1.MovementDB.findByPk(movement_id);
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
