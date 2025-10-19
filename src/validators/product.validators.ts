import { check } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { ProductDB, CategoryDB } from "../config";

export class ProductValidators {
    
    validateFields = [
        check("name", "El nombre del producto es obligatorio.").not().isEmpty(),
        check("name", "El nombre del producto debe ser una cadena de texto.").isString(),
        
        check("description", "La descripción del producto es obligatoria.").not().isEmpty(),
        check("description", "La descripción del producto debe ser una cadena de texto.").isString(),

        check("category_id", "El ID de la categoría es obligatorio.").not().isEmpty(),
        check("category_id", "El ID de la categoría debe ser un número entero.").isNumeric(),

        check("base_price", "El precio base del producto es obligatorio.").not().isEmpty(),
        check("base_price", "El precio base del produce debe ser un número decimal.").isDecimal(),

        check("min_stock", "El stock mínimo del producto es obligatorio.").not().isEmpty(),
        check("min_stock", "El precio mínimo del producto debe ser un número entero.").isNumeric(),
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