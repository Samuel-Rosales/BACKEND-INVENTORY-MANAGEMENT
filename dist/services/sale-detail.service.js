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
exports.SaleDetailServices = void 0;
const config_1 = require("../config");
class SaleDetailService {
    async getAll() {
        try {
            const SalesDetails = await config_1.SaleDetailDB.findAll({
                include: [
                    { model: config_1.SaleDB, as: "sale" },
                    { model: config_1.ProductDB, as: "product" },
                ],
            });
            return {
                status: 200,
                message: "Sales details obtained correctly",
                data: SalesDetails,
            };
        }
        catch (error) {
            console.error("Error fetching sales details: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(sale_detail_id) {
        try {
            const saleDetail = await config_1.SaleDetailDB.findByPk(sale_detail_id, {
                include: [
                    { model: config_1.SaleDB, as: "sale" },
                    { model: config_1.ProductDB, as: "product" },
                ]
            });
            return {
                status: 200,
                message: "Sale detail obtained correctly",
                data: saleDetail,
            };
        }
        catch (error) {
            console.error("Error fetching sale detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(saleDetail) {
        try {
            const { createdAt, updatedAt, status } = saleDetail, saleDetailData = __rest(saleDetail, ["createdAt", "updatedAt", "status"]);
            const newSaleDetail = await config_1.SaleDetailDB.create(saleDetailData);
            return {
                status: 201,
                message: "Sale detail created successfully",
                data: newSaleDetail,
            };
        }
        catch (error) {
            console.error("Error creating sale detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(sale_detail_id, saleDetail) {
        try {
            const { createdAt, updatedAt, sale_detail_id: _ } = saleDetail, saleDetailData = __rest(saleDetail, ["createdAt", "updatedAt", "sale_detail_id"]);
            await config_1.SaleDetailDB.update(saleDetailData, { where: { sale_detail_id } });
            const updatedSaleDetail = await config_1.SaleDetailDB.findByPk(sale_detail_id);
            return {
                status: 200,
                message: "Sale detail update correctly",
                data: updatedSaleDetail,
            };
        }
        catch (error) {
            console.error("Error updating sale detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(sale_detail_id) {
        try {
            await config_1.SaleDetailDB.destroy({ where: { sale_detail_id } });
            return {
                status: 200,
                message: "Sale detail deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting sale detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.SaleDetailServices = new SaleDetailService();
