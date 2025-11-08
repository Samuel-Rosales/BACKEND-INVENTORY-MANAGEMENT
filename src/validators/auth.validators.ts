import { check } from "express-validator";

class AuthValidator {
    
    // Un array de middlewares de validación para el login
    validateLoginFields = [
        check("user_ci")
            .notEmpty().withMessage("El CI es obligatorio.")
            .isString().withMessage("El CI debe ser una cadena de texto."),
            
        check("password")
            .notEmpty().withMessage("La contraseña es obligatoria.")
            .isString().withMessage("La contraseña debe ser una cadena de texto."),
    ];

}

export const authValidators = new AuthValidator();