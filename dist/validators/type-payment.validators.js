"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typePaymentValidators = exports.TypePaymentValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class TypePaymentValidators {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("name")
                .notEmpty().withMessage("El nombre del tipo de pago es obligatorio.")
                .isString().withMessage("El nombre del tipo de pago debe ser una cadena de texto."),
        ];
        this.validateTypePaymentParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!rawId)
                    return next();
                const type_payment_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(type_payment_id) || !Number.isInteger(type_payment_id)) {
                    return res.status(400).json({ message: `El ID proporcionado "${rawId}" no es un número entero válido.` });
                }
                if (type_payment_id <= 0) {
                    return res.status(400).json({ message: `El ID "${rawId}" no puede ser un numero negativo.` });
                }
                // consulta DB
                const existingTypePayment = await config_1.TypePaymentDB.findByPk(type_payment_id);
                if (!existingTypePayment) {
                    return res.status(404).json({ message: `Tipo de pago con ID "${type_payment_id}" no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateTypePaymentParamIdExists.",
                });
            }
        };
    }
}
exports.TypePaymentValidators = TypePaymentValidators;
exports.typePaymentValidators = new TypePaymentValidators();
