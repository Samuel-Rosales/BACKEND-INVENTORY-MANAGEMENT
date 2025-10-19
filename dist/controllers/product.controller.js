"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const services_1 = require("../services");
class ProductController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.ProductServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.ProductServices.getOne(Number(id));
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.ProductServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const { id } = req.params;
            const { status, message, data } = await services_1.ProductServices.update(Number(id), req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { id } = req.params;
            const { status, message } = await services_1.ProductServices.delete(Number(id));
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.ProductController = ProductController;
