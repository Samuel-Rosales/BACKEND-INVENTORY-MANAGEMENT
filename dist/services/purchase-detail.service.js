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
exports.PurchaseDetailServices = void 0;
const models_1 = require("../models");
class PurchaseDetailService {
    async getAll() {
        try {
            const purchasesDetails = await models_1.PurchaseDetailDB.findAll({
                include: [
                    { model: models_1.PurchaseDB, as: "purchase" },
                    { model: models_1.ProductDB, as: "product" },
                ],
            });
            return {
                status: 200,
                message: "Purchases details obtained correctly",
                data: purchasesDetails,
            };
        }
        catch (error) {
            console.error("Error fetching purchases details: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(purchase_detail_id) {
        try {
            const purchaseDetail = await models_1.PurchaseDetailDB.findByPk(purchase_detail_id, {
                include: [
                    { model: models_1.PurchaseDB, as: "purchase" },
                    { model: models_1.ProductDB, as: "product" },
                ]
            });
            return {
                status: 200,
                message: "Purchase detail obtained correctly",
                data: purchaseDetail,
            };
        }
        catch (error) {
            console.error("Error fetching purchase detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(purchaseDetail) {
        try {
            const { createdAt, updatedAt } = purchaseDetail, purchaseDetailData = __rest(purchaseDetail, ["createdAt", "updatedAt"]);
            const newPurchaseDetail = await models_1.PurchaseDetailDB.create(purchaseDetailData);
            return {
                status: 201,
                message: "Purchase detail created successfully",
                data: newPurchaseDetail,
            };
        }
        catch (error) {
            console.error("Error creating purchase detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(purchase_detail_id, purchaseDetail) {
        try {
            const { createdAt, updatedAt, purchase_detail_id: _ } = purchaseDetail, purchaseDetailData = __rest(purchaseDetail, ["createdAt", "updatedAt", "purchase_detail_id"]);
            await models_1.PurchaseDetailDB.update(purchaseDetailData, { where: { purchase_detail_id } });
            const updatedPurchaseDetail = await models_1.PurchaseDetailDB.findByPk(purchase_detail_id);
            return {
                status: 200,
                message: "Purchase detail update correctly",
                data: updatedPurchaseDetail,
            };
        }
        catch (error) {
            console.error("Error updating purchase detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(purchase_detail_id) {
        try {
            await models_1.PurchaseDetailDB.destroy({ where: { purchase_detail_id } });
            return {
                status: 200,
                message: "Purchase detail deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting purchase detail: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.PurchaseDetailServices = new PurchaseDetailService();
