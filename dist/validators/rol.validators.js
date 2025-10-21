"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolValidators = exports.RolValidator = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
class RolValidator {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("name", "El nombre del rol es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("name", "El nombre del rol debe ser una cadena de texto.").isString(),
        ];
        this.validateRolParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const rol_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(rol_id) || !Number.isInteger(rol_id) || rol_id <= 0) {
                    return res.status(400).json({
                        message: `El ID de rol "${rawId}" no es válido.`,
                    });
                }
                const existingRol = await models_1.RolDB.findByPk(rol_id);
                if (!existingRol) {
                    return res.status(404).json({
                        message: `Categoría con ID "${rol_id}" no encontrado.`,
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateCtegoryParamIdExists.",
                });
            }
        };
    }
}
exports.RolValidator = RolValidator;
exports.rolValidators = new RolValidator();
