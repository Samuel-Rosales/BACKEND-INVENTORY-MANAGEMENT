"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidators = exports.UserValidators = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class UserValidators {
    constructor() {
        this.validateCreateFields = [
            (0, express_validator_1.check)("ci")
                .notEmpty().withMessage("La cédula del usuario es obligatoria.")
                .isLength({ min: 7, max: 8 }).withMessage("La cédula debe tener entre 7 y 8 caracteres.")
                .isString().withMessage("La cédula debe ser una cadena de texto."),
            (0, express_validator_1.check)("name")
                .notEmpty().withMessage("El nombre del usuario es obligatorio.")
                .isString().withMessage("El nombre debe ser una cadena de texto."),
            (0, express_validator_1.check)("password")
                .notEmpty().withMessage("La contraseña es obligatoria.")
                .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres."),
            (0, express_validator_1.check)("rol_id")
                .notEmpty().withMessage("El ID del rol es obligatorio.")
                .isInt().withMessage("El ID del rol debe ser un número entero."),
            (0, express_validator_1.check)("status")
                .notEmpty().withMessage("El estado del usuario es obligatorio.")
                .isBoolean().withMessage("El estado del usuario debe ser un valor booleano."),
        ];
        this.validateUpdateFields = [
            (0, express_validator_1.check)("name")
                .optional()
                .notEmpty().withMessage("El nombre no puede estar vacío.")
                .isString().withMessage("El nombre debe ser una cadena de texto."),
            (0, express_validator_1.check)("password")
                .optional()
                .notEmpty().withMessage("La contraseña no puede estar vacía.")
                .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres."),
            (0, express_validator_1.check)("rol_id")
                .optional()
                .notEmpty().withMessage("El ID del rol no puede estar vacío.")
                .isInt().withMessage("El ID del rol debe ser un número entero."),
            (0, express_validator_1.check)("status")
                .optional()
                .notEmpty().withMessage("El estado no puede estar vacío.")
                .isBoolean().withMessage("El estado debe ser un valor booleano."),
        ];
        this.validateRolIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.body.rol_id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const rol_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(rol_id) || !Number.isInteger(rol_id) || rol_id <= 0) {
                    return res.status(400).json({
                        message: `El ID del rol '${rawId}' no es válido.`,
                    });
                }
                const rol = await config_1.RolDB.findByPk(rol_id);
                if (!rol) {
                    return res.status(400).json({
                        message: `El rol con ID '${rol_id}' no existe.`
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateRolExists."
                });
            }
        };
        this.validateUserParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const user_ci = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!user_ci)
                    return next();
                if (!user_ci || user_ci.length < 6 || user_ci.length > 10 || !/^\d{6,10}$/.test(user_ci)) {
                    return res.status(400).json({
                        message: `La cédula proporcionada '${user_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                    });
                }
                const existingUser = await config_1.UserDB.findByPk(user_ci);
                if (!existingUser) {
                    return res.status(404).json({ message: `Usuario con la cédula '${user_ci}' no encontrado.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateUserIdExists.",
                });
            }
        };
        this.validateUserAlreadyExists = async (req, res, next) => {
            var _a;
            try {
                const user_ci = ((_a = req.body.ci) !== null && _a !== void 0 ? _a : "").toString().trim();
                if (!user_ci)
                    return next();
                if (!user_ci || user_ci.length < 6 || user_ci.length > 10 || !/^\d{6,10}$/.test(user_ci)) {
                    return res.status(400).json({
                        message: `La cédula proporcionada '${user_ci}' no es válida. Debe ser un número entre 6 y 10 dígitos.`,
                    });
                }
                const existingUser = await config_1.UserDB.findByPk(user_ci);
                if (existingUser) {
                    return res.status(400).json({ message: `Ya existe un usuario registrado con la cédula: '${user_ci}'.` });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateUserAlreadyExists.",
                });
            }
        };
    }
}
exports.UserValidators = UserValidators;
exports.userValidators = new UserValidators();
