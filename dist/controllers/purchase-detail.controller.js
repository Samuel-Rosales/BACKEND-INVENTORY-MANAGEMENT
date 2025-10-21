"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDetailController = void 0;
const services_1 = require("../services");
class PurchaseDetailController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.PurchaseDetailServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.PurchaseDetailServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.PurchaseDetailServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.PurchaseDetailServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.PurchaseDetailServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.PurchaseDetailController = PurchaseDetailController;
