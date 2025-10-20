"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor() {
        this.all = async (req, res) => {
            const { status, message, data } = await services_1.UserServices.getAll();
            return res.status(status).json({
                message,
                data,
            });
        };
        this.one = async (req, res) => {
            const { ci } = req.params;
            const { status, message, data } = await services_1.UserServices.getOne(ci);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.create = async (req, res) => {
            const { status, message, data } = await services_1.UserServices.create(req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.update = async (req, res) => {
            const ci = req.params.id;
            const { status, message, data } = await services_1.UserServices.update(ci, req.body);
            return res.status(status).json({
                message,
                data,
            });
        };
        this.delete = async (req, res) => {
            const { ci } = req.params;
            const { status, message } = await services_1.UserServices.delete(ci);
            return res.status(status).json({
                message,
            });
        };
    }
}
exports.UserController = UserController;
