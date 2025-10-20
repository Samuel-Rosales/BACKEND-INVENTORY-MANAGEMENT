"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const services_1 = require("../services");
class ClientController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.ClientServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.ClientServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.ClientServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.ClientServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.ClientServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.ClientController = ClientController;
