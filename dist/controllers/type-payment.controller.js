"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypePaymentController = void 0;
const services_1 = require("../services");
class TypePaymentController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.TypePaymentServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.TypePaymentServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.TypePaymentServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.TypePaymentServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.TypePaymentServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.TypePaymentController = TypePaymentController;
