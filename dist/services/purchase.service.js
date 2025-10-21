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
exports.PurchaseServices = void 0;
const config_1 = require("../config");
class PurchaseService {
    async getAll() {
        try {
            const purchases = await config_1.PurchaseDB.findAll({
                include: [
                    { model: config_1.ProviderDB, as: "provider" },
                    { model: config_1.UserDB, as: "user" },
                    { model: config_1.TypePaymentDB, as: "type_payment" },
                    { model: config_1.PurchaseDetailDB, as: "purchase_details" },
                ],
            });
            return {
                status: 200,
                message: "Purchases obtained correctly",
                data: purchases,
            };
        }
        catch (error) {
            console.error("Error fetching purchases: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(purchase_id) {
        try {
            const purchase = await config_1.PurchaseDB.findByPk(purchase_id, {
                include: [
                    { model: config_1.ProviderDB, as: "provider" },
                    { model: config_1.UserDB, as: "user" },
                    { model: config_1.TypePaymentDB, as: "type_payment" },
                ]
            });
            return {
                status: 200,
                message: "Purchase obtained correctly",
                data: purchase,
            };
        }
        catch (error) {
            console.error("Error fetching purchase: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(purchase) {
        try {
            const { createdAt, updatedAt, purchase_id } = purchase, purchaseData = __rest(purchase, ["createdAt", "updatedAt", "purchase_id"]);
            const newPurchase = await config_1.PurchaseDB.create(purchaseData);
            return {
                status: 201,
                message: "Purchase created successfully",
                data: newPurchase,
            };
        }
        catch (error) {
            console.error("Error creating purchase: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(purchase_id, purchase) {
        try {
            const { createdAt, updatedAt, purchase_id: _ } = purchase, purchaseData = __rest(purchase, ["createdAt", "updatedAt", "purchase_id"]);
            await config_1.PurchaseDB.update(purchaseData, { where: { purchase_id } });
            const updatedPurchase = await config_1.PurchaseDB.findByPk(purchase_id);
            return {
                status: 200,
                message: "Purchase update correctly",
                data: updatedPurchase,
            };
        }
        catch (error) {
            console.error("Error updating purchase: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(purchase_id) {
        try {
            await config_1.PurchaseDB.destroy({ where: { purchase_id } });
            return {
                status: 200,
                message: "Purchase deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting purchase: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.PurchaseServices = new PurchaseService();
