import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { ProductDB, CategoryDB } from "../models";

export class ProductValidators {
    
    validateCreateFields = [
        check("name")
            .notEmpty().withMessage("El nombre del producto es obligatorio.")
            .isString().withMessage("El nombre del producto debe ser una cadena de texto."),
            
        check("description")
            .notEmpty().withMessage("La descripción del producto es obligatoria.")
            .isString().withMessage("La descripción del producto debe ser una cadena de texto."),

        check("category_id")
            .notEmpty().withMessage("El ID de la categoría es obligatorio.")
            .isInt().withMessage("El ID de la categoría debe ser un número entero."),

        check("base_price")
            .notEmpty().withMessage("El precio base del producto es obligatorio.")
            .isDecimal().withMessage("El precio base del producto debe ser un número decimal."),

        check("min_stock")
            .notEmpty().withMessage("El stock mínimo del producto es obligatorio.")
            .isInt({ min: 0 }).withMessage("El stock mínimo debe ser un número entero igual o mayor a 0."),
    ];

    validateUpdateFields = [
        check("name")
            .optional()
            .notEmpty().withMessage("El nombre no puede ser una cadena vacía.")
            .isString().withMessage("El nombre debe ser una cadena de texto."),
            
        check("description")
            .optional()
            .notEmpty().withMessage("La descripción no puede ser una cadena vacía.")
            .isString().withMessage("La descripción debe ser una cadena de texto."),

        check("category_id")
            .optional()
            .notEmpty().withMessage("El ID de la categoría no puede estar vacío.")
            .isInt().withMessage("El ID de la categoría debe ser un número entero."),

        check("base_price")
            .optional()
            .notEmpty().withMessage("El precio base no puede estar vacío.")
            .isDecimal().withMessage("El precio base debe ser un número decimal."),

        check("min_stock")
            .optional()
            .notEmpty().withMessage("El stock mínimo no puede estar vacío.")
            .isInt({ min: 0 }).withMessage("El stock mínimo debe ser un número entero igual o mayor a 0."),
    ];

    validateCatgegoryIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.category_id ?? "").toString().trim();
            const category_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(category_id) || !Number.isInteger(category_id) || category_id <= 0) {
                return res.status(400).json({
                    message: `El ID de categoría "${rawId}" no es válido.`,
                });
            }
            //verificar si la categoría existe
            const category = await CategoryDB.findByPk(category_id);

            if (!category) {
                return res.status(400).json({
                    message: `La categoría con ID ${category_id} no existe.`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ 
                message: "Internal server error in validateCategoryExists."
            }); 
        }
    };

    validateProductParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            if (!rawId) return next();

            const product_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(product_id) || !Number.isInteger(product_id)) {
                return res.status(400).json({ message: `El ID proporcionado "${rawId}" no es un número entero válido.` });
            }

            if (product_id <= 0) {
                return res.status(400).json({ message: `El ID "${rawId}" no puede ser un numero negativo.` });
            }

             // consulta DB
            const existingProduct = await ProductDB.findByPk(product_id);
            if (!existingProduct) {
                return res.status(404).json({ message: `Producto con ID "${product_id}" no encontrado.` });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateProductIdExists.",
            });
        }
    };
    
}

export const productValidators = new ProductValidators();