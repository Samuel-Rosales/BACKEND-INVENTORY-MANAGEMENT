"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategroyController = void 0;
const services_1 = require("../services");
class CategroyController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.CategoryServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.CategoryServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.CategoryServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.CategoryServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.CategroyController = CategroyController;
