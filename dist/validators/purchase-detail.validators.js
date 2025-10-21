"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseDetailValidators = exports.PurchaseDetailValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class PurchaseDetailValidators {
    constructor() {
        this.validateCreateFields = [
            (0, express_validator_1.check)("product_id")
                .notEmpty().withMessage("El ID del producto es obligatorio.")
                .isInt().withMessage("El ID del producto debe ser un número entero."),
            (0, express_validator_1.check)("purchase_id")
                .notEmpty().withMessage("El ID de la compra es obligatorio.")
                .isInt().withMessage("El ID de la compra debe ser un número entero."),
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
                .notEmpty().withMessage("El estado del detalle de la compra no puede estar vacío.")
                .isBoolean().withMessage("El estado del detalle de la compra debe ser un valor booleano."),
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
        this.validatePurchaseIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.purchase_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const pruchase_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(pruchase_id) || !Number.isInteger(pruchase_id)) {
                    return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
                }
                if (pruchase_id <= 0) {
                    return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingPruchase = await config_1.PurchaseDB.findByPk(pruchase_id);
                if (!existingPruchase) {
                    return res.status(404).json({ message: `Compra con ID '${pruchase_id}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validatePurchaseIdExists.",
                });
            }
        };
        this.validatePurchaseDetailParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const purchase_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(purchase_id) || !Number.isInteger(purchase_id)) {
                    return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
                }
                if (purchase_id <= 0) {
                    return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingSale = await config_1.SaleDetailDB.findByPk(purchase_id);
                if (!existingSale) {
                    return res.status(404).json({ message: `Detalle de compra con ID '${purchase_id}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validatePurchaseDetailParamIdExists.",
                });
            }
        };
    }
}
exports.PurchaseDetailValidators = PurchaseDetailValidators;
exports.purchaseDetailValidators = new PurchaseDetailValidators();
