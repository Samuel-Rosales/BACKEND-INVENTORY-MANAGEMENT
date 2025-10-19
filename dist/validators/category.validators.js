"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidators = exports.CategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class CategoryValidator {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("name", "El nombre de la categoría es obligatorio").not().isEmpty(),
            (0, express_validator_1.check)("name", "El nombre de la categoría debe ser una cadena de texto").isString(),
            (0, express_validator_1.check)("description", "la descripción de la categoría es obligatorio").not().isEmpty(),
            (0, express_validator_1.check)("description", "La descripción de la categoría debe ser una cadena de texto").isString(),
        ];
        this.validateCategoryIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.category_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const category_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(category_id) || !Number.isInteger(category_id) || category_id <= 0) {
                    return res.status(400).json({
                        message: `El ID de categoría "${rawId}" no es válido.`,
                    });
                }
                const existingCategory = await config_1.CategoryDB.findByPk(category_id);
                if (!existingCategory) {
                    return res.status(404).json({
                        message: `Category con ID "${category_id}" no encontrado.`
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateCategoryIdExists.",
                });
            }
            ;
        };
    }
}
exports.CategoryValidator = CategoryValidator;
exports.categoryValidators = new CategoryValidator();
