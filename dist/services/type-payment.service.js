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
exports.TypePaymentServices = void 0;
const models_1 = require("../models");
class TypePaymentService {
    async getAll() {
        try {
            const typesPaymets = await models_1.TypePaymentDB.findAll();
            return {
                status: 200,
                message: "Types payments obtained correctly",
                data: typesPaymets,
            };
        }
        catch (error) {
            console.error("Error fetching Types payments: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(type_payment_id) {
        try {
            const typePayment = await models_1.TypePaymentDB.findByPk(type_payment_id);
            return {
                status: 200,
                message: "Type payment obtained correctly",
                data: typePayment,
            };
        }
        catch (error) {
            console.error("Error fetching type payment: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(typePayment) {
        try {
            const { createdAt, updatedAt } = typePayment, typePaymentData = __rest(typePayment, ["createdAt", "updatedAt"]);
            const newTypePayment = await models_1.TypePaymentDB.create(typePaymentData);
            return {
                status: 201,
                message: "Type payment created successfully",
                data: newTypePayment,
            };
        }
        catch (error) {
            console.error("Error creating type payment: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(type_payment_id, typePayment) {
        try {
            const { createdAt, updatedAt, type_payment_id: _ } = typePayment, typePaymentData = __rest(typePayment, ["createdAt", "updatedAt", "type_payment_id"]);
            await models_1.TypePaymentDB.update(typePaymentData, { where: { type_payment_id } });
            const updatedTypePayment = await models_1.TypePaymentDB.findByPk(type_payment_id);
            return {
                status: 200,
                message: "Type payment update correctly",
                data: updatedTypePayment,
            };
        }
        catch (error) {
            console.error("Error updating type payment: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(type_payment_id) {
        try {
            await models_1.TypePaymentDB.destroy({ where: { type_payment_id } });
            return {
                status: 200,
                message: "Type payment deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting type payment: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.TypePaymentServices = new TypePaymentService();
