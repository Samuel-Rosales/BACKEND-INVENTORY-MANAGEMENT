"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerValidators = exports.ProviderValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class ProviderValidators {
    constructor() {
        this.validateCreateFields = [
            (0, express_validator_1.check)("name")
                .notEmpty().withMessage("El nombre del proveedor es obligatorio.")
                .isString().withMessage("El nombre del proveedor debe ser una cadena de texto."),
            (0, express_validator_1.check)("located")
                .notEmpty().withMessage("La ubicación del proveedor es obligatoria.")
                .isString().withMessage("La ubicación del proveedor debe ser una cadena de texto."),
        ];
        this.validateUpdateFields = [
            (0, express_validator_1.check)("name")
                .optional()
                .notEmpty().withMessage("El nombre del proveedor es obligatorio.")
                .isString().withMessage("El nombre del proveedor debe ser una cadena de texto."),
            (0, express_validator_1.check)("located")
                .optional()
                .notEmpty().withMessage("La ubicación del proveedor es obligatoria.")
                .isString().withMessage("La ubicación del proveedor debe ser una cadena de texto."),
        ];
        this.validateProviderParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const provider_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(provider_id) || !Number.isInteger(provider_id)) {
                    return res.status(400).json({ message: `El ID proporcionado '${rawId}' no es un número entero válido.` });
                }
                if (provider_id <= 0) {
                    return res.status(400).json({ message: `El ID '${rawId}' no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingProvider = await config_1.ProviderDB.findByPk(provider_id);
                if (!existingProvider) {
                    return res.status(404).json({ message: `Tipo de pago con ID '${provider_id}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateProviderParamIdExists.",
                });
            }
        };
    }
}
exports.ProviderValidators = ProviderValidators;
exports.providerValidators = new ProviderValidators();
