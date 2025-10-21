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
exports.ProviderServices = void 0;
const models_1 = require("../models");
class ProviderService {
    async getAll() {
        try {
            const providers = await models_1.ProviderDB.findAll();
            return {
                status: 200,
                message: "Providers obtained correctly",
                data: providers,
            };
        }
        catch (error) {
            console.error("Error fetching providers: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(provider_id) {
        try {
            const provider = await models_1.ProviderDB.findByPk(provider_id);
            return {
                status: 200,
                message: "Provider obtained correctly",
                data: provider,
            };
        }
        catch (error) {
            console.error("Error fetching provider: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(provider) {
        try {
            const { createdAt, updatedAt } = provider, providerData = __rest(provider, ["createdAt", "updatedAt"]);
            const newProvider = await models_1.ProviderDB.create(providerData);
            return {
                status: 201,
                message: "Provider created successfully",
                data: newProvider,
            };
        }
        catch (error) {
            console.error("Error creating provider: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(provider_id, provider) {
        try {
            const { createdAt, updatedAt, provider_id: _ } = provider, providerData = __rest(provider, ["createdAt", "updatedAt", "provider_id"]);
            await models_1.ProviderDB.update(providerData, { where: { provider_id } });
            const updatedProvider = await models_1.ProviderDB.findByPk(provider_id);
            return {
                status: 200,
                message: "Provider update correctly",
                data: updatedProvider,
            };
        }
        catch (error) {
            console.error("Error updating provider: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(provider_id) {
        try {
            await models_1.ProviderDB.destroy({ where: { provider_id } });
            return {
                status: 200,
                message: "Provider deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting provider: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.ProviderServices = new ProviderService();
