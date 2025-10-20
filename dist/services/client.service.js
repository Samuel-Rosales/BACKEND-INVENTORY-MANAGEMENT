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
exports.ClientServices = void 0;
const config_1 = require("../config");
class ClientService {
    async getAll() {
        try {
            const clients = await config_1.ClientDB.findAll();
            return {
                status: 200,
                message: "Clients obtained correctly",
                data: clients,
            };
        }
        catch (error) {
            console.error("Error fetching clients: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async getOne(client_id) {
        try {
            const client = await config_1.ClientDB.findByPk(client_id);
            return {
                status: 200,
                message: "Client obtained correctly",
                data: client,
            };
        }
        catch (error) {
            console.error("Error fetching client: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async create(client) {
        try {
            const { createdAt, updatedAt } = client, clientData = __rest(client, ["createdAt", "updatedAt"]);
            const newClient = await config_1.ClientDB.create(clientData);
            return {
                status: 201,
                message: "Client created successfully",
                data: newClient,
            };
        }
        catch (error) {
            console.error("Error creating client: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async update(client_ci, client) {
        try {
            const { createdAt, updatedAt } = client, clientData = __rest(client, ["createdAt", "updatedAt"]);
            await config_1.ClientDB.update(clientData, { where: { client_ci } });
            const updatedClient = await config_1.ClientDB.findByPk(client_ci);
            return {
                status: 200,
                message: "Client update correctly",
                data: updatedClient,
            };
        }
        catch (error) {
            console.error("Error updating client: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
    async delete(client_ci) {
        try {
            await config_1.ClientDB.destroy({ where: { client_ci } });
            return {
                status: 200,
                message: "Client deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting client: ", error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    }
}
exports.ClientServices = new ClientService();
