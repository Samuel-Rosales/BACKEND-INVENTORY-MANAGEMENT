"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const services_1 = require("../services");
class SaleController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.SaleServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.SaleServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.SaleServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.SaleServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.SaleServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.SaleController = SaleController;
