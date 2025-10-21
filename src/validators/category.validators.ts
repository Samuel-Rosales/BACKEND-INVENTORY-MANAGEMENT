import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { CategoryDB } from "../models";

export class CategoryValidator {

    validateFields = [
        check("name", "El nombre de la categoría es obligatorio.").not().isEmpty(),    
        check("name", "El nombre de la categoría debe ser una cadena de texto.").isString(),

        check("description", "la descripción de la categoría es obligatorio.").not().isEmpty(),
        check("description", "La descripción de la categoría debe ser una cadena de texto.").isString(),    
    ];

    /*validateCategoryIdExists = async (req: Request, res: Response, next: NextFunction) => {   
        try { 
            const rawId = (req.body.id ?? "").toString().trim();
            const category_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(category_id) || !Number.isInteger(category_id) || category_id <= 0 ) {
                return res.status(400).json({
                    message: `El ID de categoría "${rawId}" no es válido.`,
                });
            }

            const existingCategory = await CategoryDB.findByPk(category_id);

            if (!existingCategory) {
                return res.status(404).json ({
                    message: `Categoría con ID "${category_id}" no encontrado.`
                });
            }

            next();
        } catch (error) { 
            return res.status(500).json({
                message: "Internal server error in validateCategoryIdExists.",
            });
        };
    };*/

    validateCategoryParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            const category_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(category_id) || !Number.isInteger(category_id) || category_id <= 0) {
                return res.status(400).json({
                    message: `El ID de categoría "${rawId}" no es válido.`,
                });
            }

            const existingCategory = await CategoryDB.findByPk(category_id);

            if (!existingCategory) {
                return res.status(404).json({
                    message: `Categoría con ID "${category_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateCategoryParamIdExists.",
            });
        }
    };
}

export const categoryValidators = new CategoryValidator();