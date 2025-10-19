"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depotValidators = exports.DepotValidator = void 0;
const express_validator_1 = require("express-validator");
const config_1 = require("../config");
class DepotValidator {
    constructor() {
        this.validateFields = [
            (0, express_validator_1.check)("name", "El nombre del almacén es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("name", "El nombre del almacén debe ser una cadena de texto.").isString(),
            (0, express_validator_1.check)("location", "La ubicación del almacén es obligatorio.").not().isEmpty(),
            (0, express_validator_1.check)("location", "La ubicación del almacén debe ser una cadena de texto.").isString(),
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
        this.validateDepotParamIdExists = async (req, res, next) => {
            var _a;
            try {
                const rawId = ((_a = req.params.id) !== null && _a !== void 0 ? _a : "").toString().trim();
                const depot_id = Number.parseInt(rawId, 10);
                if (Number.isNaN(depot_id) || !Number.isInteger(depot_id) || depot_id <= 0) {
                    return res.status(400).json({
                        message: `El ID de Almacén "${rawId}" no es válido.`,
                    });
                }
                const existingDepot = await config_1.DepotDB.findByPk(depot_id);
                if (!existingDepot) {
                    return res.status(404).json({
                        message: `Almacén con ID "${depot_id}" no encontrado.`,
                    });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({
                    message: "Internal server error in validateCategoryParamIdExists.",
                });
            }
        };
    }
}
exports.DepotValidator = DepotValidator;
exports.depotValidators = new DepotValidator();
