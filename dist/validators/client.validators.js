"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientValidators = exports.ClientValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class ClientValidators {
    constructor() {
        this.validateCreateFields = [
            (0, express_validator_1.check)("client_ci")
                .notEmpty().withMessage("La cédula del cliente es obligatoria.")
                .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
                .isString().withMessage("La cédula debe ser una cadena de texto."),
            (0, express_validator_1.check)("name")
                .notEmpty().withMessage("El nombre del cliente es obligatorio.")
                .isString().withMessage("El nombre del cliente debe ser una cadena de texto."),
            (0, express_validator_1.check)("phone")
                .notEmpty().withMessage("El teléfono del cliente es obligatoria.")
                .isString().withMessage("El teléfono del cliente debe ser una cadena de texto."),
            (0, express_validator_1.check)("address")
                .notEmpty().withMessage("La dirección del cliente es obligatoria.")
                .isString().withMessage("La dirección del cliente debe ser una cadena de texto."),
        ];
        this.validateUpdateFields = [
            (0, express_validator_1.check)("client_ci")
                .optional()
                .notEmpty().withMessage("La cédula del cliente es obligatoria.")
                .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
                .isString().withMessage("La cédula debe ser una cadena de texto."),
            (0, express_validator_1.check)("name")
                .optional()
                .notEmpty().withMessage("El nombre del cliente es obligatorio.")
                .isString().withMessage("El nombre del cliente debe ser una cadena de texto."),
            (0, express_validator_1.check)("phone")
                .optional()
                .notEmpty().withMessage("La teléfono del cliente es obligatoria.")
                .isString().withMessage("La teléfono del cliente debe ser una cadena de texto."),
            (0, express_validator_1.check)("address")
                .optional()
                .notEmpty().withMessage("La dirección del cliente es obligatoria.")
                .isString().withMessage("La dirección del cliente debe ser una cadena de texto."),
            (0, express_validator_1.check)("status")
                .optional()
                .notEmpty().withMessage("El estado del cliente no puede estar vacío.")
                .isBoolean().withMessage("El estado debe ser un valor booleano."),
        ];
        this.validateClientParamCIExists = async (req, res, next) => {
            var _a;
            try {
                const client_ci = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!client_ci)
                    return next();
                if (!client_ci || client_ci.length < 6 || client_ci.length > 10 || !/^\d{6,10}$/.test(client_ci)) {
                    return res.status(400).json({
                        message: `La cédula proporcionada '${client_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                    });
                }
                const existingClient = await config_1.ClientDB.findByPk(client_ci);
                if (!existingClient) {
                    return res.status(404).json({ message: `Cliente con la cédula '${client_ci}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateClientParamCIExists.",
                });
            }
        };
    }
}
exports.ClientValidators = ClientValidators;
exports.clientValidators = new ClientValidators();
