"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidators = exports.ProductValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class ProductValidators {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("name", "El nombre del producto es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("name", "El nombre del producto debe ser una cadena de texto.").isString(),
            (0, express_validator_1.check)("description", "La descripción del producto es obligatoria.").not().isEmpty(),
            (0, express_validator_1.check)("description", "La descripción del producto debe ser una cadena de texto.").isString(),
            (0, express_validator_1.check)("category_id", "El ID de la categoría es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("category_id", "El ID de la categoría debe ser un número entero.").isNumeric(),
            (0, express_validator_1.check)("base_price", "El precio base del producto es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("base_price", "El precio base del produce debe ser un número decimal.").isDecimal(),
            (0, express_validator_1.check)("min_stock", "El stock mínimo del producto es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("min_stock", "El precio mínimo del producto debe ser un número entero.").isNumeric(),
        ];
        this.validateCatgegoryIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.category_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const category_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(category_id) || !Number.isInteger(category_id) || category_id <= 0) {
                    return res.status(400).json({
                        message: `El ID de categoría "${rawId}" no es válido.`,
                    });
                }
                //verificar si la categoría existe
                const category = await config_1.CategoryDB.findByPk(category_id);
                if (!category) {
                    return res.status(400).json({
                        message: `La categoría con ID ${category_id} no existe.`
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateCategoryExists."
                });
            }
        };
        this.validateProductParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const product_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(product_id) || !Number.isInteger(product_id)) {
                    return res.status(400).json({ message: `El ID proporcionado "${rawId}" no es un número entero válido.` });
                }
                if (product_id <= 0) {
                    return res.status(400).json({ message: `El ID "${rawId}" no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingProduct = await config_1.ProductDB.findByPk(product_id);
                if (!existingProduct) {
                    return res.status(404).json({ message: `Producto con ID "${product_id}" no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateProductIdExists.",
                });
            }
        };
    }
}
exports.ProductValidators = ProductValidators;
exports.productValidators = new ProductValidators();
