"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFields = void 0;
const express_validator_1 = require("express-validator");
const validateFields = (req, res, next) => {
    console.log("--- Executing validateFields ---");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("Errores de validación encontrados:", errors.array());
        return res.status(400).json(errors);
    }
    console.log("No hay errores de validación.");
    next();
};
exports.validateFields = validateFields;
