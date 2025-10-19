"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotController = void 0;
const services_1 = require("../services");
class DepotController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.DepotServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.DepotServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.DepotServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.DepotServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.DepotServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.DepotController = DepotController;
