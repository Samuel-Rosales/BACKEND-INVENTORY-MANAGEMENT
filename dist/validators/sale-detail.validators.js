"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleDetailValidators = exports.SaleDetailValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class SaleDetailValidators {
    constructor() {
        this.validateCreateFields = [
            (0, express_validator_1.check)("product_id")
                .notEmpty().withMessage("El ID del producto es obligatorio.")
                .isInt().withMessage("El ID del producto debe ser un número entero."),
            (0, express_validator_1.check)("sale_id")
                .notEmpty().withMessage("El ID de la venta es obligatorio.")
                .isInt().withMessage("El ID de la venta debe ser un número entero."),
            (0, express_validator_1.check)("unit_cost")
                .notEmpty().withMessage("El costo unitario del producto es obligatorio.")
                .isDecimal().withMessage("El costo unitario del producto debe ser un número decimal."),
            (0, express_validator_1.check)("amount")
                .notEmpty().withMessage("La cantidad del producto es obligatorio.")
                .isInt().withMessage("La cantidad del producto debe ser un número entero."),
        ];
        this.validateUpdateFields = [
            (0, express_validator_1.check)("product_id")
                .optional()
                .notEmpty().withMessage("El ID del producto es obligatorio.")
                .isInt().withMessage("El ID del producto debe ser un número entero."),
            (0, express_validator_1.check)("sale_id")
                .optional()
                .notEmpty().withMessage("El ID de la venta es obligatorio.")
                .isInt().withMessage("El ID de la venta debe ser un número entero."),
            (0, express_validator_1.check)("unit_cost")
                .optional()
                .notEmpty().withMessage("El costo unitario del producto es obligatorio.")
                .isDecimal().withMessage("El costo unitario del producto debe ser un número decimal."),
            (0, express_validator_1.check)("amount")
                .optional()
                .notEmpty().withMessage("La cantidad del producto es obligatorio.")
                .isInt().withMessage("La cantidad del producto debe ser un número entero."),
            (0, express_validator_1.check)("status")
                .optional()
                .notEmpty().withMessage("El estado del detalle de la venta no puede estar vacío.")
                .isBoolean().withMessage("El estado del detalle de la venta debe ser un valor booleano."),
        ];
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
                        message: `El ID '${rawId}' no puede ser un numero negativo.`
                    });
                }
                // consulta DB
                const existingProduct = await config_1.ProductDB.findByPk(product_id);
                if (!existingProduct) {
                    return res.status(404).json({
                        message: `Producto con ID '${product_id}' no encontrado.`
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
        this.validateSaleIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.sale_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const sale_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(sale_id) || !Number.isInteger(sale_id)) {
                    return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
                }
                if (sale_id <= 0) {
                    return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingSale = await config_1.SaleDB.findByPk(sale_id);
                if (!existingSale) {
                    return res.status(404).json({ message: `Venta con ID '${sale_id}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateSaleIdExists.",
                });
            }
        };
        this.validateSaleDetailParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const sale_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(sale_id) || !Number.isInteger(sale_id)) {
                    return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
                }
                if (sale_id <= 0) {
                    return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingSale = await config_1.SaleDetailDB.findByPk(sale_id);
                if (!existingSale) {
                    return res.status(404).json({ message: `Detalle de venta con ID '${sale_id}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateSaleDetailParamIdExists.",
                });
            }
        };
    }
}
exports.SaleDetailValidators = SaleDetailValidators;
exports.saleDetailValidators = new SaleDetailValidators();
