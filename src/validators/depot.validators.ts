import { check } from "express-validator"; 
import type { NextFunction, Request, Response } from "express";
import { DepotDB } from "../models";

export class DepotValidator {

    validateFields = [
        check("name", "El nombre del almacén es obligatorio.").not().isEmpty(),    
        check("name", "El nombre del almacén debe ser una cadena de texto.").isString(),

        check("location", "La ubicación del almacén es obligatorio.").not().isEmpty(),    
        check("location", "La ubicación del almacén debe ser una cadena de texto.").isString(),

        /*check("status", "El estado del almacén es obligatorio.").not().isEmpty(),
        check("status", "El estado del almacén debe ser un valor booleano.").isBoolean(),   */
    ];

    /*validateDepotIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.body.depot_id ?? "").toString().trim();
            const depot_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                return res.status(400).json({
                    message: `el ID del almacén "${rawId}" no es válido.`, 
                });
            }

            const exitingDepot = await DepotDB.findByPk(depot_id);

            if (!exitingDepot) {
                return res.status(404).json({
                    message: `Almacén con ID "${depot_id}" no encontrado.`,
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error in validateDepotExists.",
            });
        }
    };*/

    validateDepotParamIdExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawId = (req.params.id ?? "").toString().trim();
            const depot_id = Number.parseInt(rawId, 10);

            if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                return res.status(400).json({
                    message: `El ID de Almacén "${rawId}" no es válido.`,
                });
            }

            const existingDepot = await DepotDB.findByPk(depot_id);

            if (!existingDepot) {
                return res.status(404).json({
                    message: `Almacén con ID "${depot_id}" no encontrado.`,
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
export const depotValidators = new DepotValidator();