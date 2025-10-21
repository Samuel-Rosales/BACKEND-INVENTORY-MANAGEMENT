"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleServices = void 0;
const models_1 = require("../models");
class SaleService {
    async getAll() {
        try {
            const sales = await models_1.SaleDB.findAll({
                include: [
                    { model: models_1.ClientDB, as: "client" },
                    { model: models_1.UserDB, as: "user" },
                    { model: models_1.TypePaymentDB, as: "type_payment" },
                    { model: models_1.SaleDetailDB, as: "sale_details" },
                ],
            });
            return {
                status: 200,
                message: "Sales obtained correctly",
                data: sales,
            };
        }
        catch (error) {
            console.error("Error fetching sales: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(sale_id) {
        try {
            const sale = await models_1.SaleDB.findByPk(sale_id, {
                include: [
                    { model: models_1.ClientDB, as: "client" },
                    { model: models_1.UserDB, as: "user" },
                    { model: models_1.TypePaymentDB, as: "type_payment" },
                ]
            });
            return {
                status: 200,
                message: "Sale obtained correctly",
                data: sale,
            };
        }
        catch (error) {
            console.error("Error fetching Sale: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(sale) {
        try {
            const { createdAt, updatedAt } = sale, saleData = __rest(sale, ["createdAt", "updatedAt"]);
            const newSale = await models_1.SaleDB.create(saleData);
            return {
                status: 201,
                message: "Sale created successfully",
                data: newSale,
            };
        }
        catch (error) {
            console.error("Error creating sale: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(sale_id, sale) {
        try {
            const { createdAt, updatedAt, sale_id: _ } = sale, saleData = __rest(sale, ["createdAt", "updatedAt", "sale_id"]);
            await models_1.SaleDB.update(saleData, { where: { sale_id } });
            const updatedSale = await models_1.SaleDB.findByPk(sale_id);
            return {
                status: 200,
                message: "Sale update correctly",
                data: updatedSale,
            };
        }
        catch (error) {
            console.error("Error updating sale: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(sale_id) {
        try {
            await models_1.SaleDB.destroy({ where: { sale_id } });
            return {
                status: 200,
                message: "Sale deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting sale: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.SaleServices = new SaleService();
